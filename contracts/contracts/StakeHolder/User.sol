// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

contract User {
    address public admin;
    address public mainEscrow;
    struct UserInfo {
        bool registered;
        string name;
        string aadharHash;
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
    //mapping to store the adharHash occurance
    mapping(string => bool) public adharPresent;

    mapping(address => UserInfo) public customerDetails;

    mapping(address => mapping(address=>bool)) public whitelistedEscrow;

    constructor(){
        admin = msg.sender;
    }

    function isCustomerOnRide(address user) external view returns(bool answer){
        return customerDetails[user].onRide;
    }

    function isCustomerRegistered(address user) external view returns(bool answer){
        return customerDetails[user].registered;
    }

    function setEscrow(address _mainEscrow) external{ 
        require(msg.sender == admin, "only admin");
        mainEscrow = _mainEscrow;
    }
    function Register(address user, string memory name, string memory aadharHash) external {
        if(msg.sender == admin){
        UserInfo storage detail = customerDetails[user];
        require(!adharPresent[aadharHash], "Identity already present");
        detail.registered = true;
        detail.name = name;
        detail.aadharHash = aadharHash;
        adharPresent[aadharHash] = true;
        whitelistedEscrow[user][mainEscrow] = true;
        }
        else{
            revert UnauthorisedAccess();
        }
    }
    function changeOnRideStatus(address _user) external {
        require(whitelistedEscrow[_user][msg.sender], "not whitelisted");
        if(customerDetails[_user].onRide){
            customerDetails[_user].onRide = false;
            customerDetails[_user].totalRides++;
            customerDetails[_user].whenRideStartedEnded = block.timestamp;
        }
        else{
            customerDetails[_user].onRide = true;
            customerDetails[_user].whenRideStartedEnded = block.timestamp;
        }
    }

    function toggleWhitelistEscrow(address _escrow) external {
        whitelistedEscrow[msg.sender][_escrow] = !whitelistedEscrow[msg.sender][_escrow];
    }
    
    function updateRating(address user, Rating x) external {
        require(whitelistedEscrow[user][msg.sender], "Can't rate");
        if(x == Rating.VeryBad){
            customerDetails[user].rating = (customerDetails[user].rating+1000)/customerDetails[user].totalRides;
        }
        else if(x == Rating.Bad) {
            customerDetails[user].rating = (customerDetails[user].rating + 2000)/customerDetails[user].totalRides;
        }
        else if(x == Rating.Fair) {
            customerDetails[user].rating = (customerDetails[user].rating + 3000)/customerDetails[user].totalRides;
        }
        else if(x == Rating.Good) {
            customerDetails[user].rating = (customerDetails[user].rating + 4000)/customerDetails[user].totalRides;
        }
        else  {
            customerDetails[user].rating = (customerDetails[user].rating + 5000)/customerDetails[user].totalRides;
        }
    }

    function overrideRideToggle() external {
        if (
            customerDetails[msg.sender].onRide &&
            customerDetails[msg.sender].whenRideStartedEnded - block.timestamp >
            86400
        ) {
            customerDetails[msg.sender].onRide = false;
            customerDetails[msg.sender].whenRideStartedEnded = block.timestamp;
        } else {
            revert Uncallable();
        }
    }
}
