const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const betterAccount = "0xd85D821D66a58811Cb7A8f97aA2fBC185829f400";
async function main() {
  Escrow = await ethers.getContractFactory("Escrow");
  Escrow = await Escrow.deploy("0x93C875cb811d4F5Eb701CFa5220F71f217634b72", "0xacA8e401CFf46C03268084B13Eb4CC8Fe5CE1176", "0x33A5081C44d521B030376A3f707a4D52017F4F34");
  console.log("Escrow address: ",Escrow.target);

  // user = await ethers.getContractFactory("inr");
  // user = await user.deploy(betterAccount);
  // console.log("user address", user.target);
  // sleep(5000)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
