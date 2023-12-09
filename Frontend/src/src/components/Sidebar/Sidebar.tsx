import React, { useState } from 'react'
import styles from "./Sidebar.module.scss";
import { Link } from 'react-router-dom';
import { DashboardIcon, LogoutIcon, SettingsIcon } from '../../assets/icons';

const Sidebar = () => {
    const [active, setActive] = useState(false);
    const handleActive = () => setActive(!active);
    return (
        <>
            <button onClick={handleActive} className={`${styles.toggler} ${active ? styles.active : ""}`}>
                <span></span>
                <span></span>
                <span></span>
            </button>
            <aside className={`${styles.sidebar} ${active ? styles.active : ""}`}>
                <ul>
                    <li>
                        <Link to="">
                            <span className={styles.icon}>
                                <DashboardIcon />
                            </span>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="">
                            <span className={styles.icon}>
                                <SettingsIcon />
                            </span>
                            Settings
                        </Link>
                    </li>
                    <li>
                        <Link to="">
                            <span className={styles.icon}>
                                <LogoutIcon />
                            </span>
                            Logout
                        </Link>
                    </li>
                </ul>
            </aside>
        </>
    )
}

export default Sidebar
