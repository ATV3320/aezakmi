// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

import "./StakeHolder/User.sol";
import "./StakeHolder/User.sol";

import "./Interfaces/IUser.sol";
import "./Interfaces/IDriver.sol";
// import "./Iinr.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract Escrow {
    uint256 public currentRideId;
    IUser public user;
    IDriver public driver;
    IERC20 public inr;
    enum FareAggression {
        LowTraffic,
        ModerateTraffic,
        CrowdedCity
    }
    enum RideUrgency {
        Low,
        Medium,
        High
    }
    enum RideStage {
        rideCreated,
        driverOnTheWay,
        driverReached,
        passengerOnBoarded,
        destinationReached,
        rideFinished
    }
    enum Rating {
        VeryBad,
        Bad,
        Fair,
        Good,
        Excellent
    }
    struct UserInfo {
        bool registered;
        string name;
        string aadharHash;
        uint totalRides;
        uint rating;
        bool onRide;
        uint whenRideStartedEnded;
    }
    struct rideDetails {
        uint lockedAmount;
        address driver;
        address customer;
        uint256 totalDistance;
        uint256 totalFare;
        Rating userToDriver;
        Rating driverToUser;
        RideStage ridestage;
        uint rideDuration;
        RideUrgency rideurgency;
        bool userRated;
        bool driverRated;
    }

    error RiderAlreadyAssigned(address assignedDriver);
    error InvalidCall();
    error WrongState(RideStage currentRideStage);
    error FetchingNewAmountFailed(uint deltaAmount);
    error peculiarRequest();

    event rideCreated(uint rideId, rideDetails x);
    event rideUrgencyChanged(uint rideId, RideUrgency newRideUrgency);
    event rideStageChanged(uint rideId, RideStage newRideStage);
    event moneySettled(uint rideId, address receiver, uint amount);

    mapping(uint256 => rideDetails) public ridedetails;
    mapping(uint256 => bool) public ongoingRide;

    constructor(
        address _user,
        address _driver,
        address _inr
    ) {
        user = IUser(_user);
        driver = IDriver(_driver);
        inr = IERC20(_inr);
    }

    //distance is in m, time in seconds
    function fareCalculator(
        uint rideDistance,
        uint rideTime
    ) public pure returns (uint) {
        uint answer = 30 + rideDistance * 12 / 1000;
        //calculating that average speed is > 40kph or not
        if (rideDistance * 9 > rideTime * 100) {
            return answer;
        } else {
            //for traffic congestion, we take extra 20%
            return (answer * 12) / 10;
        }
    }

    function penaltyCalculator(
        uint distance,
        uint deltaTime,
        RideUrgency rideurgency
    ) public pure returns (uint) {
        uint reachingDistance;
        if (rideurgency == RideUrgency.Low) {
            reachingDistance = (distance * 3) / 10;
        } else if (rideurgency == RideUrgency.Medium) {
            reachingDistance = (distance * 5) / 10;
        } else {
            reachingDistance = (distance * 7) / 10;
        }
        //averaging 20kph, if the driver is late, then slash his income
        //30kph
        if ((reachingDistance * 9) / 50 < deltaTime) {
            return 10;
        } else if ((reachingDistance * 3) / 25 > deltaTime) {
            return 15;
        } else {
            return 0;
        }
    }

    function fareDistributor(
        uint _rideId,
        bool destinationOrMid
    ) internal returns (uint x) {
        x = ridedetails[_rideId].lockedAmount;
        address ourdriver = ridedetails[_rideId].driver;
        if (!destinationOrMid) {
            if (ridedetails[_rideId].rideurgency == RideUrgency.Low) {
                x = (x * 3) / 13;
            } else if (ridedetails[_rideId].rideurgency == RideUrgency.Medium) {
                x = (x * 5) / 15;
            } else {
                x = (x * 7) / 17;
            }
        }
        ridedetails[_rideId].lockedAmount -= x;
        inr.transfer(ourdriver, x);
        emit moneySettled(_rideId, ourdriver, x);
    }

    function bookRide(
        uint rideDistance,
        uint rideTime,
        RideUrgency _rideUrgency
    ) external {

        // require(
        //     user.isCustomerOnRide(msg.sender) &&
        //         !user.isCustomerRegistered(msg.sender),
        //     "Invalid rider, or still on ride"
        // );
        uint amount = fareCalculator(rideDistance, rideTime);

        if (_rideUrgency == RideUrgency.High) {
            amount = (amount * 17) / 10;
            // inr.transferFrom(msg.sender, address(this), amount);
        } else if (_rideUrgency == RideUrgency.Medium) {
            amount = (amount * 15) / 10;
            // inr.transferFrom(msg.sender, address(this), amount);
        } else {
            amount = (amount * 13) / 10;
        }
            inr.transferFrom(msg.sender, address(this), amount);
        ongoingRide[currentRideId] = true;
        ridedetails[currentRideId] = rideDetails(
            amount,
            msg.sender,
            msg.sender,
            rideDistance,
            0,
            Rating.Excellent,
            Rating.Excellent,
            RideStage.rideCreated,
            0,
            _rideUrgency,
            false,
            false
        );
        currentRideId++;
    }

    function changerideurgency(uint _rideId) internal {
        rideDetails storage x = ridedetails[_rideId];
        if (x.rideurgency == RideUrgency.Low) {
            uint newAmount = (x.lockedAmount * 15) / 13;
            if (
                inr.transferFrom(
                    msg.sender,
                    address(this),
                    newAmount - x.lockedAmount
                )
            ) {
                x.lockedAmount = newAmount;
                x.rideurgency = RideUrgency.Medium;
            } else {
                revert FetchingNewAmountFailed(newAmount - x.lockedAmount);
            }
        } else if (x.rideurgency == RideUrgency.Medium) {
            uint newAmount = (x.lockedAmount * 17) / 15;
            if (
                inr.transferFrom(
                    msg.sender,
                    address(this),
                    newAmount - x.lockedAmount
                )
            ) {
                x.lockedAmount = newAmount;
                x.rideurgency = RideUrgency.High;
            } else {
                revert FetchingNewAmountFailed(newAmount - x.lockedAmount);
            }
        } else {
            revert InvalidCall();
        }
    }

    function changeRideUrgency(uint _rideId) external {
        rideDetails storage x = ridedetails[_rideId];
        if (msg.sender == x.customer) {
            changerideurgency(_rideId);
        } else {
            revert InvalidCall();
        }
    }

    function acceptRide(uint rideId) external {
        // require(
        //     driver.driverDetails(msg.sender).registered &&
        //         !driver.driverDetails(msg.sender).onRide,
        //     "either not registered or on ride"
        // );
        if (ridedetails[rideId].driver == ridedetails[rideId].customer) {
            ridedetails[rideId].driver = msg.sender;
            ridedetails[rideId].ridestage = RideStage.driverOnTheWay;
            ridedetails[rideId].rideDuration = block.timestamp;
        } else {
            revert RiderAlreadyAssigned(ridedetails[rideId].driver);
        }
    }

    function bothMet(uint rideId, bool successfulMeet) external {
        rideDetails storage x = ridedetails[rideId];

        if (msg.sender == x.driver) {
            if (x.ridestage == RideStage.driverOnTheWay && successfulMeet) {
                x.ridestage = RideStage.driverReached;
            } else {
                revert WrongState(x.ridestage);
            }
        } else if (msg.sender == x.customer) {
            if (
                x.ridestage == RideStage.driverOnTheWay ||
                x.ridestage == RideStage.driverReached
            ) {
                if (successfulMeet) {
                    x.ridestage = RideStage.passengerOnBoarded;
                    fareDistributor(rideId, false);
                } else {
                    uint cut = penaltyCalculator(
                        x.totalDistance,
                        block.timestamp - x.rideDuration,
                        x.rideurgency
                    );
                    x.lockedAmount = x.lockedAmount - cut;
                    inr.transfer(msg.sender, cut);
                    emit moneySettled(rideId, x.driver, cut);
                    fareDistributor(rideId, false);
                }
            } else {
                revert WrongState(x.ridestage);
            }
        } else {
            revert InvalidCall();
        }
    }

    function changeRideFare(uint rideId, uint proposedAmount) external {
        rideDetails storage x = ridedetails[rideId];
        if (
            x.ridestage == RideStage.rideCreated ||
            x.ridestage == RideStage.rideFinished
        ) {
            revert InvalidCall();
        } else {
            if (msg.sender == x.driver) {
                if (proposedAmount < x.lockedAmount) {
                    uint delta = x.lockedAmount - proposedAmount;
                    inr.transfer(x.customer, delta);
                    x.lockedAmount = proposedAmount;
                } else {
                    revert peculiarRequest();
                }
            } else if (msg.sender == x.customer) {
                if (proposedAmount > x.lockedAmount) {
                    uint delta = proposedAmount - x.lockedAmount;
                    inr.transferFrom(msg.sender, address(this), delta);
                    x.lockedAmount = proposedAmount;
                } else {
                    revert peculiarRequest();
                }
            } else {
                revert InvalidCall();
            }
        }
    }

    function rideEnd(uint rideId) external {
        rideDetails storage x = ridedetails[rideId];

        if (msg.sender == x.driver) {
            if (x.ridestage == RideStage.passengerOnBoarded) {
                x.ridestage = RideStage.destinationReached;
                //update the driver's portfolio in other contract from here
            } else {
                revert WrongState(x.ridestage);
            }
        } else if (msg.sender == x.customer) {
            if (
                x.ridestage == RideStage.destinationReached ||
                x.ridestage == RideStage.passengerOnBoarded
            ) {
                x.ridestage = RideStage.rideFinished;
                fareDistributor(rideId, true);
                //update the driver's portfolio in other contract from here
                ongoingRide[currentRideId] = false;
            } else {
                revert WrongState(x.ridestage);
            }
        } else {
            revert InvalidCall();
        }
    }

    function rate(uint rideId, Rating _rating) external {
        
        
    }
}
