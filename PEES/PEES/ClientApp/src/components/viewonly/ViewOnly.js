import React, { useEffect } from "react"
import { connect } from "react-redux"
import Filter from '../search/Filter'
import { Container, Row, Col } from 'reactstrap'
import UnitsCard from "../search/UnitsCard"
import Cookies from "js-cookie"

const ViewOnly = (props) => {

    useEffect(() => {
        Cookies.set("ViewOnlyToken", "view")

        fetch('/api/users/configurationviewonly').then(response => response.json()).then(json => {
            localStorage.setItem("configuration", JSON.stringify(json))
            props.dispatch({ type: "VIEW_ONLY", payload: true })
        })        
    }, [props])

    if (!props.viewOnly)
        return (<></>)

    return (
        <Container>
            <Row>
                <Col>
                    <Filter />
                </Col>
            </Row>
            <Row style={{ marginTop: 1 + "em" }}>
                <Col>
                    <UnitsCard />
                </Col>
            </Row>
        </Container>
        )
}

function mapStateToProps(state) {
    return {
        viewOnly: state.viewOnly
    }
}

export default connect(mapStateToProps)(ViewOnly)
