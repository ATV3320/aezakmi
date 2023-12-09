import React, { ReactNode } from 'react'
import styles from "./Button.module.scss";

type propTypes = {
    disabled?: boolean,
    text?: string,
    children?: string | ReactNode,
    onClick?: () => void,
    className?: string,
    fluid?: boolean,
    variant?: string,
    title?: string,
    active?: boolean,
}

const Button = (props: propTypes) => {
    return (
        <button
            className={`${styles.btn} ${props.active ? styles.active : ""} ${props.className || ""} ${props.fluid ? "w-100" : ""}`}
            disabled={props.disabled}
            onClick={props.onClick}
            title={props.title}
            data-variant={props.variant}
        >
            {
                props.text || props.children
            }

        </button>
    )
}

export default Button
