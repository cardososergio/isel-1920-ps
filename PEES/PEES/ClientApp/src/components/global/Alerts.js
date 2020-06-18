import React from 'react'
import { connect } from "react-redux"
import { Alert } from 'reactstrap'
import { HideToast } from "../global/Utils"

const Alerts = (props) => {

    if (!props.attr.show)
        return (<></>)

    if (!props.attr.fixed)
        setTimeout(function () {
            props.dispatch(HideToast())
        }, 5000)

    return (
        <div style={{ position: "fixed", top: 5 + "px", width: 100 + "%", zIndex: 2050, display: "block" }}>
            {props.attr.fixed ?
                <Alert color={props.attr.color} fade={true} style={{ maxWidth: 30 + "%", margin: "0 auto", paddingTop: 20 + "px", paddingBottom: 20 + "px" }}
                    toggle={() => props.dispatch(HideToast())}>{props.attr.text}</Alert>
                :
                <Alert color={props.attr.color} fade={true} style={{ maxWidth: 30 + "%", margin: "0 auto", paddingTop: 20 + "px", paddingBottom: 20 + "px" }}>{props.attr.text}</Alert>
            }
        </div >
    );
}

export default connect()(Alerts)