import express from 'express';
import { verify , init} from "anon-aadhaar-pcd"
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import {uploadEncryptedText,accessControl, decrypt} from '../helper/UploadFileHelper/UploadFileHelperFunc.js'
import * as dotenv from 'dotenv';
import fs from 'fs/promises';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const apiKey = process.env.API_KEY;
const private_key = process.env.PRIVATE_KEY;
const public_key = process.env.PUBLIC_KEY;

const readJsonFile = async (filePath) => {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      // console.log(data);
      return data
      // return JSON.parse(data);
    } catch (error) {
      console.error('Error reading JSON file:', error.message);
      throw error;
    }
  };
  
  
router.post("/verify_proof", bodyParser.json(),async (req,res)=>{

try{
    // const jsonData = req.body;
    const data = req.body; //QmRMgVJ3VZh7kSuaoB7FF9i5drkmqMncCW1PVS4Gy5TwCB
    console.log(data.cid);
    const result = await decrypt(data.cid,public_key,private_key);
    console.log(result);
    let dirname = __dirname + "/../helper"
    const pcdInitArgs = {
      wasmURL: dirname + '/main.wasm',
      zkeyURL: dirname + '/circuit_final.zkey',
      vkeyURL: dirname + "/verification_key.json",
      isWebEnv: false,
    }

    await init(pcdInitArgs);
   
    //   const jsonDataPath = '/data/ETHIndia/routes/zk_proof.json'; 
    //   const anon_json = await readJsonFile(jsonDataPath);
    //   console.log(anon_json);
      const parsed_json = JSON.parse(result)
      console.log(parsed_json);
    const isValidProof = await verify(parsed_json);
    console.log("======",isValidProof);
    if(isValidProof){
        res.json({ isValid: true });
    }
    else{
        res.json({isValid: false});
    }

}catch(error){
    res.status(500).json({
        message : "Invalid Input Data"
    });

}
        
})




router.post("/upload_proof",bodyParser.json(),async (req,res)=>{
    try{
        const anon_json = req.body;
        // console.log("-----------",anon_json);
        console.log("Hello",JSON.stringify(anon_json));
        const anon = JSON.stringify(anon_json);
        // console.log("----------",JSON.parse(anon_json));
    //    const response = await uploadEncryptedText(`${anon_json.data}`, apiKey, public_key, private_key);
       const response = await uploadEncryptedText(anon, apiKey, public_key, private_key);


       res.status(200).json({ 
        dataUploaded: true ,
        dataInfo : response.data.Hash
    });
    await accessControl(response.data.Hash ,public_key,private_key);

    }catch(error){
        res.status(500).json({ 
            dataUploaded: false ,
            dataInfo : null
        });
    }
})

router.post('/send-paragraph', (req, res) => {
    try {
        const paragraph = req.body.text;
      
        // Do something with the paragraph (e.g., log it)
        console.log('Received paragraph:', paragraph);

        // Respond with a success message or other relevant response
        res.json({ success: true, message: 'Paragraph received successfully.' });
    } catch (error) {
        console.error('Error processing the request:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

export default router;