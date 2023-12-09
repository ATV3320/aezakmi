const { expect } = require("chai");
const { ethers } = require("hardhat");
// import { Contract, ContractFactory, utils } from "ethers";
const { time, expectRevert } = require("@openzeppelin/test-helpers");

describe("checking end to end flow of our smart contracts", function () {

  let user;
  let owner;
  let user1;
  let user2;
  let user3;
  let user4;
  let user5;
  let user6;
 
  //target
  beforeEach(async function () {
    [owner, user1, user2, user3, user4, user5, user6] = await ethers.getSigners();

    getUserFactory = await ethers.getContractFactory("User");
    user = await getUserFactory.connect(owner).deploy();
    
    
    getDriverFactory = await ethers.getContractFactory("Driver");
    driver = await getDriverFactory.connect(owner).deploy();
    
    
    getInrFactory = await ethers.getContractFactory("inr");
    inr = await getInrFactory.connect(owner).deploy(owner.address);
    
    getEscrowFactory = await ethers.getContractFactory("Escrow");
    escrow = await getEscrowFactory.connect(owner).deploy(user.target, driver.target, inr.target);

    await user.connect(owner).setEscrow(escrow.target);
    await driver.connect(owner).setEscrow(escrow.target);


    await user.Register(owner.address, "Aryan", "12334");
    await inr.mint(owner.address, 100000000);
    await inr.connect(owner).approve(escrow.target, 1000000);

    await driver.Register(user1.address, "keshav", "43321", "dl453d");
  });

  it("Testing setting the main escrow", async function () {
    const escrowAddress = await user.mainEscrow();
    console.log(escrowAddress);
    console.log(escrow.target);

  });

  it("Tests the registration of a user", async function () {
    await user.Register(owner.address, "Aryan", "1234");
    const shouldBeYes = await user.adharPresent("1234");
    console.log("ShouldBeYes is:", shouldBeYes);
    const userInfo = await user.customerDetails(owner.address);
    console.log("userInfo is:", userInfo);
  });

  it("Registers, gets money and lets me book the ride", async function () {
    //booking ride
    // console.log(await user.getCustomerDetails(owner.address));
    const result = await escrow.connect(owner).bookRide(100000, 9000, 1);
    const bal = await inr.balanceOf(escrow.target);

    console.log("balance is", bal);

  });

  it("Lets the driver accept the ride", async function() {
    const result = await escrow.connect(owner).bookRide(100000, 9000, 1);
    const res1 = await escrow.connect(user1).acceptRide(0);
    const rideDet = await escrow.ridedetails(0);
    console.log("My ride details are:", rideDet);
  });

  it("Lets the ride upgrade in stages", async function() {
    const result = await escrow.connect(owner).bookRide(100000, 9000, 1);
    const res1 = await escrow.connect(user1).acceptRide(0);
    let rideDet = await escrow.ridedetails(0);
    console.log("ride details before both met from rider", rideDet)
    let balDriver = await inr.balanceOf(user1.address);
    console.log("In the start the balance of driver is:", balDriver);
    const res2 = await escrow.connect(owner).bothMet(0,true);
    rideDet = await escrow.ridedetails(0);
    console.log("ride details after both met", rideDet);
    balDriver = await inr.balanceOf(user1.address);
    console.log("balance of driver before ride ends", balDriver);
    const res3 = await escrow.connect(owner).rideEnd(0)
    rideDet = await escrow.ridedetails(0);
    console.log("after the ride ends, this is what happens.", rideDet);
    balDriver = await inr.balanceOf(user1.address);
    console.log("balance of driver after the ride ends", balDriver);
  });
});