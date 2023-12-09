import { log } from "@web3auth/base"
import { useEffect, useState } from "react"

import { useHuddle01 } from '@huddle01/react';
import { useAudio, useEventListener, useLobby, usePeers, useRoom, useVideo } from '@huddle01/react/hooks';
import { useAppUtils } from "@huddle01/react/app-utils";
import { Video, Audio } from '@huddle01/react/components'
import styles from "./Layout.module.scss";
import Button from "../src/components/Button/Button";

const ChatComponent = (props: any) => {
  console.log("room",props);
  
  const [chats,setChats]=useState<any>([])
  
  

  useEffect(()=>{

  },[chats])

  const APIKEY = "LhdzYNjP0w-YuvD2ko9hT_mX1mk2VA6y"
  const ProjectID = "6rdDYKc5_cm6w1t4H5C0wp_nOI84Z_8H"

  const { initialize, isInitialized, me } = useHuddle01();
  const [ROOMID, setROOMID] = useState("")
  const [inputroom, setinputroom] = useState("")
  const [anotherpeer, setanotherpeer] = useState("")

  const { joinLobby } = useLobby();
  const { joinRoom, leaveRoom } = useRoom();
  const { sendData } = useAppUtils()
  const peers = usePeers();
  const [riderpeerID,setriderpeerID]=useState<any>("")
console.log("rider",riderpeerID);

console.log("me",me);


  useEventListener("room:data-received", (data) => {
    console.log("rdaata", data);
    setChats(data?.payload?.message)
  })
  useEventListener("room:joined", (data) => {
    console.log("roomjoined", data);
  })
  useEventListener("lobby:metadata", (data) => {
    joinRoom()
    console.log("rlobby", data);
  })

  useEffect(() => {
    // its preferable to use env vars to store projectId
    initialize(ProjectID);
  }, []);

  useEffect(() => {
    if (isInitialized && props.roomId) {
console.log("initialized");
joinLobby(props.roomId)
    }
  }, [isInitialized])

  const [chattext,setchattext] = useState("")
  
  const sendtext=()=>{
    sendData([props.anotherpeer], { message: [...chats,chattext] })
setchattext("")
  }

  return (
    <div className={styles.chat_box}>
      <div className={styles.chat_box_in}>
        {
          chats.map((el:any, i:any) => {
            return (
              <div key={i} className={styles.message}>
                {i % 2 === 0 ?
                  <>
                    <p className={styles.sent}>{el}</p>
                  </>
                  :
                  <>
                    <p>{el}</p>
                  </>
                }
              </div>
            )
          })
        }
      </div>
      <div className={styles.chat_box_action}>
        <input className={styles.input} value={chattext} placeholder="Message" type="text" onChange={e => setchattext(e.target.value)} />
        <Button onClick={sendtext}><i className="fa fa-paper-plane" aria-hidden="true"></i></Button>
      </div>
    </div>
  )
}

export default ChatComponent