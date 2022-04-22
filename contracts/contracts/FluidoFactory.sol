// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./FluidoToken.sol";
import "./interfaces/IFluidoFactory.sol";
import "./interfaces/IFluidoToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FluidoFactory is IFluidoFactory {
    address[] public deployedTokens;
    mapping(address => TokenDetails) public tokenDetails;

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
        uint256 length = userFunds[msg.sender].length;
        uint256 i;

        for (i = 0; i < length; i++) {
            if (userFunds[msg.sender][i] == tokenAddress) {
                userFunds[msg.sender][i] = userFunds[msg.sender][length - 1];
                userFunds[msg.sender].pop();
                break;
            }
        }
    }

    function getAllTokens()
        external
        view
        override
        returns (TokenDetails[] memory)
    {
        uint256 length = deployedTokens.length;
        TokenDetails[] memory collectedTks = new TokenDetails[](length);

        for (uint256 i = 0; i < length; i++) {
            collectedTks[i] = tokenDetails[deployedTokens[i]];
        }

        return collectedTks;
    }

    function getUserTokensLength() external view returns (uint256) {
        return userFunds[msg.sender].length;
    }

    function getUserTokens() external view returns (TokenDetails[] memory) {
        uint256 length = userFunds[msg.sender].length;
        TokenDetails[] memory collectedTks = new TokenDetails[](length);

        for (uint256 i = 0; i < length; i++) {
            collectedTks[i] = tokenDetails[userFunds[msg.sender][i]];
        }

        return collectedTks;
    }

    function getTokensLength() external view override returns (uint256) {
        return deployedTokens.length;
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

        deployedTokens.push(address(newTokenAddress));
        tokenDetails[address(newTokenAddress)] = TokenDetails({
            tokenAddress: address(newTokenAddress),
            name: _name,
            symbol: _symbol,
            description: _description,
            lockedLiquidity: 0,
            rewardPercentage: _rewardPercentage
        });

        return address(newTokenAddress);
    }
}
