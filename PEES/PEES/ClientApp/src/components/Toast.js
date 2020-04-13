import React from 'react';
import { Alert } from "reactstrap";

const Toast = (props) => {
    return (
        <Alert color="danger" isOpen={props.visible}>
            {props.msg}
        </Alert>
    );
}

export default Toast;