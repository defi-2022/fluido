// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IFluidoFactory {
    struct TokenDetails {
        address tokenAddress;
        string name;
        string symbol;
        string description;
        uint256 lockedLiquidity;
        uint256 rewardPercentage;
    }

    function mint(address tokenAddress) external payable;

    function withdraw(address tokenAddress) external;

    function getAllTokens() external view returns (TokenDetails[] memory);

    function getTokensLength() external view returns (uint256);

    function createNewToken(
        string calldata _name,
        string calldata _symbol,
        string calldata _description,
        uint256 _rewardPercentage
    ) external payable returns (address);
}
