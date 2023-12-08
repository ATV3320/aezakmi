
import { ethers } from "ethers";
import { Presets, Client } from "userop";


//const rpcUrl = "https://public.stackup.sh/api/v1/node/ethereum-sepolia";
const rpcUrl = "https://api.stackup.sh/v1/node/0e780a7861e8d9df9872fc9305c7cfc589830683668e0d672e95ed62859c322b";
const paymasterUrl = ""; // Optional - you can get one at https://app.stackup.sh/

export async function main() {
  const paymasterContext = { type: "payg" };
  const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
    paymasterUrl,
    paymasterContext
  );
  const opts =
    paymasterUrl.toString() === ""
      ? {}
      : {
        paymasterMiddleware: paymasterMiddleware,
      };

  // Initialize the account

  // is the private key we have generated through the web3 auth ---
  const signingKey = "0d2a1555a6429803d613692d3ea0d271e0a0bf972368a018da1b21930fa5af43";

  const signer: any = new ethers.Wallet(signingKey);
  var builder = await Presets.Builder.SimpleAccount.init(signer, rpcUrl, opts);
  const address = builder.getSender();

  console.log(`Account address: ${address}`);



  // Create the call data
  // const to = address; // Receiving address, in this case we will send it to ourselves
  const token = "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B"; // Address of the ERC-20 token

  //contract address *3 ---
  const changeAddress = "0x352516a637e1671d2b03ccee7Ad5386A151204a8";
  const value = "0"; // Amount of the ERC-20 token to transfer

  // Read the ERC-20 token contract

  // contract abi *3 ---
  const change_ABI = [{ "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }, { "internalType": "address", "name": "_driver", "type": "address" }, { "internalType": "address", "name": "_usdt", "type": "address" }, { "internalType": "address", "name": "_moderator", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "uint256", "name": "rideId", "type": "uint256" }], "name": "acceptRide", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "rideDistance", "type": "uint256" }, { "internalType": "uint256", "name": "rideTime", "type": "uint256" }, { "internalType": "enum Escrow.RideUrgency", "name": "_rideUrgency", "type": "uint8" }], "name": "bookRide", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "rideId", "type": "uint256" }, { "internalType": "bool", "name": "_bothMet", "type": "bool" }], "name": "bothMet", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "increase", "type": "bool" }], "name": "changeRideUrgency", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "currentRideId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "driver", "outputs": [{ "internalType": "contract IDriver", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "rideDistance", "type": "uint256" }, { "internalType": "uint256", "name": "rideTime", "type": "uint256" }], "name": "fareCalculator", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "moderator", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "rideId", "type": "uint256" }, { "internalType": "enum Escrow.Rating", "name": "_rating", "type": "uint8" }], "name": "rate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "rideId", "type": "uint256" }], "name": "rideEnd", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "usdt", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "user", "outputs": [{ "internalType": "contract IUser", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }]
  const provider: any = new ethers.JsonRpcProvider(rpcUrl);
  const change = new ethers.Contract(changeAddress, change_ABI, provider);

  // const callTo = [token, token];
  // const callData = [erc20.interface.encodeFunctionData("approve", [to, amount]),
  //                   erc20.interface.encodeFunctionData("transfer", [to, amount])]

  const callTo = [changeAddress];

  // function name and arguments ---
  const callData = [
    change.interface.encodeFunctionData("driver"),
  ];

  // Send the User Operation to the ERC-4337 mempool
  const client = await Client.init(rpcUrl);
  const res = await client.sendUserOperation(
    builder.executeBatch(callTo, callData),
    {
      onBuild: (op) => console.log("Signed UserOperation:", op),
    }
  );

  // Return receipt
  console.log(`UserOpHash: ${res.userOpHash}`);
  console.log("Waiting for transaction...");
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
  console.log(`View here: https://jiffyscan.xyz/userOpHash/${res.userOpHash}`);
}


export async function callMethods(privateKey:any,contractAddress:any,AbiJson:any,functionName:any) {
  const paymasterContext = { type: "payg" };
  const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
    paymasterUrl,
    paymasterContext
  );
  const opts =
    paymasterUrl.toString() === ""
      ? {}
      : {
        paymasterMiddleware: paymasterMiddleware,
      };

  // Initialize the account

  // is the private key we have generated through the web3 auth ---
  const signingKey = privateKey;

  const signer: any = new ethers.Wallet(signingKey);
  var builder = await Presets.Builder.SimpleAccount.init(signer, rpcUrl, opts);
  const address = builder.getSender();

  console.log(`Account address: ${address}`);



  // Create the call data
  // const to = address; // Receiving address, in this case we will send it to ourselves
  const token = "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B"; // Address of the ERC-20 token

  //contract address *3 ---
  const changeAddress = contractAddress;
  const value = "0"; // Amount of the ERC-20 token to transfer

  // Read the ERC-20 token contract

  // contract abi *3 ---
  const change_ABI = AbiJson
  const provider: any = new ethers.JsonRpcProvider(rpcUrl);
  const change = new ethers.Contract(changeAddress, change_ABI, provider);

  // const callTo = [token, token];
  // const callData = [erc20.interface.encodeFunctionData("approve", [to, amount]),
  //                   erc20.interface.encodeFunctionData("transfer", [to, amount])]

  const callTo = [changeAddress];

  // function name and arguments ---
  const callData = [
    change.interface.encodeFunctionData(functionName),
  ];

  // Send the User Operation to the ERC-4337 mempool
  const client = await Client.init(rpcUrl);
  const res = await client.sendUserOperation(
    builder.executeBatch(callTo, callData),
    {
      onBuild: (op) => console.log("Signed UserOperation:", op),
    }
  );

  // Return receipt
  console.log(`UserOpHash: ${res.userOpHash}`);
  console.log("Waiting for transaction...");
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
  console.log(`View here: https://jiffyscan.xyz/userOpHash/${res.userOpHash}`);
}


export async function getSmartContractWalletAddress(PrivateKey:any) {
  const paymasterContext = { type: "payg" };
  const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
    paymasterUrl,
    paymasterContext
  );
  const opts =
    paymasterUrl.toString() === ""
      ? {}
      : {
        paymasterMiddleware: paymasterMiddleware,
      };

  // Initialize the account

  // is the private key we have generated through the web3 auth ---
  const signingKey = PrivateKey;

  const signer: any = new ethers.Wallet(signingKey);
  var builder = await Presets.Builder.SimpleAccount.init(signer, rpcUrl, opts);
  const address = builder.getSender();

  return address;
}

