// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interfaces/IFluidoToken.sol";

contract FluidoToken is IFluidoToken, ERC20 {
    uint256 SAFE_TIMESTAMP_DIFF = 30 * 60;
    uint256 REWARD_FACTOR = 500; // 500 -> 5% 1000 -> 10%
    uint256 public totalLocked = 0;

    mapping(address => Deposit) deposits;
    uint256 rewardPercentage;
    address feeColector;
    address factoryAddress;
    string description;

    constructor(
        string memory name,
        string memory symbol,
        string memory _description,
        uint256 _rewardPercentage,
        address _factoryAddress
    ) ERC20(name, symbol) {
        factoryAddress = _factoryAddress;
        feeColector = msg.sender;
        rewardPercentage = _rewardPercentage * 100;
        description = _description;
    }

    function mint() external payable override {
        require(msg.value > 0, "value is zero");

        deposits[tx.origin] = Deposit({
            timestamp: block.timestamp,
            amount: msg.value
        });

        totalLocked += msg.value;
        _mint(tx.origin, msg.value);
    }

    function withdraw() external override {
        require(deposits[msg.sender].amount > 0, "token balance is zero");

        uint256 value = deposits[msg.sender].amount;
        delete deposits[msg.sender];

        _burn(msg.sender, balanceOf(msg.sender));
        totalLocked -= value;
        payable(msg.sender).transfer(value);
    }

    function claimReward() external override {
        require(deposits[msg.sender].amount > 0, "no available deposits");
        require(
            deposits[msg.sender].timestamp > SAFE_TIMESTAMP_DIFF,
            "Min wait required"
        );

        uint256 calculatedReward = calculateReward();
        deposits[msg.sender].timestamp = block.timestamp;
        _mint(msg.sender, calculatedReward);
    }

    function calculateReward() public view returns (uint256 calculatedReward) {
        calculatedReward =
            ((deposits[msg.sender].amount / (60 * 60 * 24 * 30)) *
                (block.timestamp - deposits[msg.sender].timestamp) *
                rewardPercentage) / // avoid overflow by dividing amount by seconds to month first
            10000; // convert 5% -> 500 to correct fraction
    }

    function getDeposit() public view returns (Deposit memory) {
        return deposits[msg.sender];
    }
}
