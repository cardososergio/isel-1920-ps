import React from "react"
import { Row, Col } from "reactstrap"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfo, faBars, faEye } from "@fortawesome/free-solid-svg-icons"

export const DocumentHeader = (props) => {

    const handleDetail = (e) => {
        e.preventDefault()
        console.log(1)
    }

    const handleHeader = (e) => {
        e.preventDefault()
    }

    const handlePreview = (e) => {
        e.preventDefault()
    }

    return (
        <Row className="header">
            <Col xs="8">{props.docName}</Col>
            <Col xs="4" className="text-right">
                <Link to="" onClick={handleDetail}><FontAwesomeIcon icon={faInfo} /></Link>
                <Link to="#" onClick={handleHeader}><FontAwesomeIcon icon={faBars} /></Link>
                <Link to="#" onClick={handlePreview}><FontAwesomeIcon icon={faEye} /></Link>
            </Col>
        </Row>
        )
}