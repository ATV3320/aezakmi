import React, { useEffect, useState } from 'react'
import { nanoid } from "nanoid";
import { LogInWithAnonAadhaar, useAnonAadhaar, AnonAadhaarProof } from "anon-aadhaar-react";
import axios from 'axios';
import './SelectBox.css'; // Make sure to create a CSS file for styling
import { callContractsMethods, getSmartContractWalletAddress } from './main';
import { DriverAbi, driverContractAddress, userContractAbi, userContractAddress } from '../Constants/Constants';
import { useSelect } from '@mui/base';
import { ethers } from 'ethers';
import Button from '../src/components/Button/Button';



const AnonAdhar = (props:any) => {
  const token = nanoid(16);
console.log("pji",props.fundAddress,props.PrivateKey);


const transferToFund = async(address:any,abi:any,method:any) => {
  console.log("calling tranfer fund");

  const privateKeySender = '0x3f98f5f7c67f7bcdbde5f99233f802e20764a612a0a4d63fbcea1c80020a4015';
  const baseGeorliRpc = 'https://endpoints.omniatech.io/v1/base/goerli/public';

  (async () => {
    const provider = new ethers.JsonRpcProvider(baseGeorliRpc);
    const signer = new ethers.Wallet(privateKeySender, provider);

 
    const contract =await new ethers.Contract(address, abi, signer);
console.log("yyy",signer);

    // Call a method of the smart contract
    async function callContractMethod() {
      try {
        // Replace 'methodName' with the actual name of the method you want to call
        if(selectedOption=="driver")
        {const result = await contract.Register( props.fundAddress,"lokesh",datainfo,"mp09");

        // Process the result
        console.log("Result:", result);
      }
       else{
        const result = await contract.Register( props.fundAddress,"lokesh",datainfo);

        // Process the result
        console.log("Result:", result);
       }

      } catch (error) {
        console.error("Error:", error);
      }
    }

    // Call the function
    callContractMethod();

    alert("fund deposition done")
  })();
}

  const [anonAadhaar] = useAnonAadhaar();
  const [datainfo,setdatainfo]=useState("")
  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
    
    if (anonAadhaar?.status === "logged-in") {
    console.log("ssss",anonAadhaar.pcd);

      axios.post("http://localhost:8001/api/v1/upload_proof", anonAadhaar.pcd).
        then((res:any) => {
          console.log("res", res);
          setdatainfo(res.data.dataInfo)
        }).catch((er: any) => {
          console.log("err", er);
        })
    }
  }, [anonAadhaar]);


 
  
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (e:any) => {
    setSelectedOption(e.target.value);
  };

console.log(selectedOption,datainfo);
const sendtocontract=async()=>{
  if(selectedOption=="driver")
  {
    transferToFund(driverContractAddress,DriverAbi,"Register")
  }
  if(selectedOption=="rider")
  {
    transferToFund(userContractAddress,userContractAbi,"Register")

  }
}

useEffect(()=>{
if(selectedOption&&datainfo)
{
  sendtocontract()
}

},[selectedOption,datainfo])
  return (


    <div style={{ textAlign: "center", display: "flex", justifyContent: "center", flexDirection: "column" }}>


<div className="select-box-container">
      <h2>Select Your Role</h2>
      <select className="select-box" value={selectedOption} onChange={handleSelectChange}>
        <option value=""> I am ?</option>
        <option value="driver">I am a Driver</option>
        <option value="rider">I am a Rider</option>
      </select>
      {selectedOption && <p>You selected: {selectedOption}</p>}
    </div>


      <div className="flex flex-col items-center gap-4 rounded-2xl max-w-screen-sm mx-auto p-8">
        {/* Render the proof if generated and valid */}
        {anonAadhaar?.status === "logged-in" && (
          <>
            <p>✅ Proof is valid</p>

          </>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>

        <LogInWithAnonAadhaar />
      </div>
      {
        selectedOption&&datainfo?

        <Button className="mt-5" fluid onClick={sendtocontract}>
Home      </Button>
:<></>
      }
    </div>
  )
}

export default AnonAdhar