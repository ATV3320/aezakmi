// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;


contract Driver {
    address public admin;
    address public mainEscrow;
    struct DriverDetails {
        bool registered;
        string name;
        string aadharHash;
        string vehicle_Number;
        uint totalRides;
        uint rating;
        bool onRide;
        uint whenRideStartedEnded;
    }

    enum Rating {
        VeryBad,
        Bad,
        Fair,
        Good,
        Excellent
    }

    error UnauthorisedAccess();
    error Uncallable();

    mapping(address=>mapping(address=>bool)) public whitelistedEscrow;

    constructor(){
        admin = msg.sender;
    }

    function isDriverOnRide(address driver) external view returns(bool answer){
        return driverDetails[driver].onRide;
    }

    function isDriverRegistered(address driver) external view returns(bool answer){
        return driverDetails[driver].registered;
    }

    function setEscrow(address _mainEscrow) external{ 
        require(msg.sender == admin, "only admin");
        mainEscrow = _mainEscrow;
    }

    //mapping to store the adharHash occurance
    mapping(string => bool) adharPresent;
    mapping(string => bool) vehiclePresent;

    // we have to create 2 mappings confirming the presence of IDs and vehicles

    mapping(address => DriverDetails) public driverDetails;

    function Register(
        address driver,
        string memory name,
        string memory aadharHash,
        string memory vehicle_number
    ) external {
        if(msg.sender == admin){
        DriverDetails storage detail = driverDetails[driver];
        require(
            !adharPresent[aadharHash] && !vehiclePresent[vehicle_number],
            "Identity already present"
        );
        detail.name = name;
        detail.aadharHash = aadharHash;
        detail.vehicle_Number = vehicle_number;
        adharPresent[aadharHash] = true;
        whitelistedEscrow[driver][mainEscrow] = true;
        detail.registered = true;
        }
        else{
            revert UnauthorisedAccess();
        }
    }

    function changeOnRideStatus(address _user) external {
        require(whitelistedEscrow[_user][msg.sender], "not whitelisted");
        if(driverDetails[_user].onRide){
            driverDetails[_user].onRide = false;
            driverDetails[_user].totalRides++;
            driverDetails[_user].whenRideStartedEnded = block.timestamp;
        }
        else{
            driverDetails[_user].onRide = true;
            driverDetails[_user].whenRideStartedEnded = block.timestamp;
        }
    }

    function toggleWhitelistEscrow(address _escrow) external {
        whitelistedEscrow[msg.sender][_escrow] = !whitelistedEscrow[msg.sender][_escrow];
    }
    
    function updateRating(address user, Rating x) external {
        require(whitelistedEscrow[user][msg.sender], "Can't rate");
        if(x == Rating.VeryBad){
            driverDetails[user].rating = (driverDetails[user].rating+1000)/driverDetails[user].totalRides;
        }
        else if(x == Rating.Bad) {
            driverDetails[user].rating = (driverDetails[user].rating + 2000)/driverDetails[user].totalRides;
        }
        else if(x == Rating.Fair) {
            driverDetails[user].rating = (driverDetails[user].rating + 3000)/driverDetails[user].totalRides;
        }
        else if(x == Rating.Good) {
            driverDetails[user].rating = (driverDetails[user].rating + 4000)/driverDetails[user].totalRides;
        }
        else  {
            driverDetails[user].rating = (driverDetails[user].rating + 5000)/driverDetails[user].totalRides;
        }
    }
    
    function overrideRideToggle() external {
        if(driverDetails[msg.sender].onRide && driverDetails[msg.sender].whenRideStartedEnded - block.timestamp > 86400){
            driverDetails[msg.sender].onRide = false;
            driverDetails[msg.sender].whenRideStartedEnded = block.timestamp;
        }
        else {
            revert Uncallable();
        }
    }


}
