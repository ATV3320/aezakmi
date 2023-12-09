// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

// Solidity interface for the User contract
interface IUser {
    struct UserInfo {
        bool registered;
        string name;
        bytes32 aadharHash;
        uint totalRides;
        uint rating;
        bool onRide;
        uint whenRideStartedEnded;
    }

    function customerDetails(address customer) external view returns (UserInfo memory);

    function Register(string memory name, bytes32 aadharHash) external;
    function isCustomerOnRide(address user) external view returns(bool answer);
    function isCustomerRegistered(address user) external view returns(bool answer);

    function addToWallet(uint amount) external;

    function overrideRideToggle() external;
}