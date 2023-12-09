
import { useHuddle01 } from '@huddle01/react';
import { useAudio, useEventListener, useLobby, usePeers, useRoom, useVideo } from '@huddle01/react/hooks';
import { useAppUtils } from "@huddle01/react/app-utils";
import { Video, Audio } from '@huddle01/react/components'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

function Huddle() {
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

  const {
    fetchAudioStream, stopAudioStream, error: micError,
    produceAudio, stopProducingAudio,stream:micStream
  } = useAudio();




  useEventListener("room:data-received", (data) => {
    console.log("rdaata", data);
  })
  const jointhelobby = () => {
    joinLobby(inputroom)
  }

  console.log("roomid", ROOMID);
  console.log(inputroom);

  useEffect(() => {
    // its preferable to use env vars to store projectId
    initialize(ProjectID);
  }, []);

  const clickme = async () => {
    const response = await axios.post(
      'https://api.huddle01.com/api/v1/create-room',
      {
        title: 'Huddle01-Test',
        hostWallets: ['0x29f54719E88332e70550cf8737293436E9d7b10b'],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': APIKEY,
        },
      }
    ).then((res) => {
      setROOMID(res.data.data.roomId)
    }).catch((err) => {
      console.log("err", err);
    })
  }

  const sendDataToSpecificPeer = () => {
    sendData([anotherpeer], { message: "Hello World" })
  };



  return <div>
    {isInitialized ? 'Hello World!' : 'Please initialize'}
    <br />

    <button onClick={clickme}>click me</button>
    <br />

    <button
      onClick={jointhelobby}>
      Join Lobby
    </button>
    <br />

    {
      ROOMID ? <p>{ROOMID}</p> : <p></p>
    }
    <br />

    <input type='text' onChange={e => { setinputroom(e.target.value) }}></input>

    <br />

    <button disabled={!joinRoom.isCallable} onClick={joinRoom}>
      JOIN_ROOM
    </button>
    <br />

    <button disabled={!leaveRoom.isCallable} onClick={leaveRoom}>
      LEAVE_ROOM
    </button>

    <button onClick={() => { console.log(peers) }}>
      show id perr
    </button>

    <button onClick={() => { console.log(me) }}>
      myid
    </button>

    <input type='text' onChange={e => { setanotherpeer(e.target.value) }}></input>
    <button onClick={() => { sendDataToSpecificPeer() }} >click to send message</button>



  

  </div>;
}



export default Huddle