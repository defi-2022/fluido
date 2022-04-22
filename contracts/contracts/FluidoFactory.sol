// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./FluidoToken.sol";
import "./interfaces/IFluidoFactory.sol";
import "./interfaces/IFluidoToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FluidoFactory is IFluidoFactory {
    TokenDetails[] public deployedTokens;
    address public owner;

    mapping(address => address[]) userFunds; // track funds in which user has invested

    constructor() {
        owner = msg.sender;
    }

    function mint(address tokenAddress) external payable override {
        require(
            IERC20(tokenAddress).balanceOf(msg.sender) == 0,
            "withdraw current funds first"
        );

        IFluidoToken(tokenAddress).mint{value: msg.value}();

        userFunds[msg.sender].push(tokenAddress);
    }

    function withdraw(address tokenAddress) external override {
        require(
            IERC20(tokenAddress).balanceOf(msg.sender) > 0,
            "user has no funds"
        );

        IFluidoToken(tokenAddress).withdraw();

        uint256 length = userFunds[msg.sender].length;
        uint256 i;

        for (i = 0; i < length; i++) {
            if (userFunds[msg.sender][i] == tokenAddress) {
                break;
            }
        }

        userFunds[msg.sender][i] = userFunds[msg.sender][length];
        userFunds[msg.sender].pop();
    }

    function getAllTokens()
        external
        view
        override
        returns (TokenDetails[] memory)
    {
        return deployedTokens;
    }

    function getTokensLength() external view override returns (uint256) {
        return deployedTokens.length;
    }

    function getUserTokens() external view returns (address[] memory) {
        return userFunds[msg.sender];
    }

    function createNewToken(
        string calldata _name,
        string calldata _symbol,
        string calldata _description,
        uint256 _rewardPercentage
    ) external payable override returns (address) {
        FluidoToken newTokenAddress = new FluidoToken(
            _name,
            _symbol,
            _description,
            _rewardPercentage,
            address(this)
        );
        deployedTokens.push(
            TokenDetails({
                tokenAddress: address(newTokenAddress),
                name: _name,
                symbol: _symbol,
                description: _description,
                lockedLiquidity: 0,
                rewardPercentage: _rewardPercentage
            })
        );

        return address(newTokenAddress);
    }
}
