import React, { useEffect } from 'react'
import { nanoid } from "nanoid";
import { LogInWithAnonAadhaar, useAnonAadhaar,AnonAadhaarProof } from "anon-aadhaar-react";
import axios from 'axios';



const AnonAdhar = () => {
  const token = nanoid(16); 

  const [anonAadhaar] = useAnonAadhaar();
  useEffect(() => {
      console.log("Anon Aadhaar status: ", anonAadhaar.status);
      if(anonAadhaar?.status === "logged-in"){
axios.post("http://localhost:8000/api/v1/upload_proof",JSON.stringify(anonAadhaar.pcd, null, 2)).
then((res)=>{
  console.log("res",res);
}).catch((er:any)=>{console.log("err",er);
})
      }
    }, [anonAadhaar]);

  return (

      
      <div style={{textAlign:"center",display:"flex",justifyContent:"center",flexDirection:"column"}}>
   
        {anonAadhaar?.status !== "logged-in" ?
          <>
                   <LogInWithAnonAadhaar />

           
          </>:<></>
        }
      <div className="flex flex-col items-center gap-4 rounded-2xl max-w-screen-sm mx-auto p-8">
        {/* Render the proof if generated and valid */}
        {anonAadhaar?.status === "logged-in" && (
          <>
            <p>✅ Proof is valid</p>
           
          </>
        )}
      </div>
    </div>
  )
}

export default AnonAdhar