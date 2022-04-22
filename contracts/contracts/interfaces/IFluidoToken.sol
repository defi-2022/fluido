// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IFluidoToken {
    struct Deposit {
        uint256 timestamp;
        uint256 amount;
    }

    function mint() external payable;

    function withdraw() external;

    function claimReward() external;
}
