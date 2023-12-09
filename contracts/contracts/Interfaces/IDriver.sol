// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

// Solidity interface for the DriverInfo contract
interface IDriver {
    struct DriverDetails {
        bool registered;
        string name;
        bytes32 aadharHash;
        string vehicle_Number;
        uint totalRides;
        uint rating;
        bool onRide;
        uint whenRideStartedEnded;
    }

    function driverDetails(
        address driver
    ) external view returns (DriverDetails memory);

    function Register(
        string memory name,
        bytes32 aadharHash,
        string memory vehicle_number
    ) external;

    function redeemMoney() external;

    function isDriverOnRide(address user) external view returns (bool answer);

    function isDriverRegistered(
        address user
    ) external view returns (bool answer);
    function changeOnRideStatus(address driver) external;

    function overrideRideToggle() external;
}
