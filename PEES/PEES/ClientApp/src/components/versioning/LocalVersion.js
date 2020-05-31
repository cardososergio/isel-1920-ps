import React from "react"
import { Row, Col } from "reactstrap"
import { ServerVersion } from "./ServerVersion"

export const LocalVersion = (props) => {

    if (props.data.length === 0)
        return (<></>)

    return (
        <>
            <Row>
                <Col style={{ borderBottom: "1px solid lightgray" }}>
                    <b>{props.title}</b>
                </Col>
            </Row>
            {
                props.data.map(item => {
                    return (
                        <Row key={item.id}>
                            <Col>{item.value}</Col>
                            <Col>
                                <ServerVersion id={item.id} type={props.type} onUpdate={props.onUpdate} />
                            </Col>
                        </Row>
                    )
                })
            }
        </>
    )
}