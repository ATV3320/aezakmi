import React, { useState } from 'react'
import styles from "./Layout.module.scss";
import { Autocomplete } from '@react-google-maps/api';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ButtonBase } from '@mui/material';
import loginimage from "./login.jpeg"
import AnonAdhar from './AnonAdhar';
const Start = () => {
    const [showAnon, setShowAnon] = useState(false)
    return (
        <main className={styles.layout}>

            <Container fluid>
                <div className={styles.layout_in}>

                    {!showAnon?
                    
                    <div style={{ marginTop: 30 }}>
                        <img src={loginimage} height={600}></img>

                        <div className={styles.source_confirmation}>
                            {/* <button onClick={()=>{ sendData([riderpeerID], { message: "Hello World" })}}>sss</button> */}

                            <div className={styles.source_confirmation_in}>
                                <Button onClick={() => { setShowAnon(true) }} style={{ width: "100%", marginTop: 10 }} >Register</Button>
                                <Button style={{ width: "100%",marginTop:10 }}>Login</Button>

                            </div>

                        </div>

                    </div>:<AnonAdhar></AnonAdhar>}
                    

                </div>
            </Container>
        </main>
    )
}

export default Start