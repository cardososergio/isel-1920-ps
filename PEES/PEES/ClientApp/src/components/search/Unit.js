import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { connect } from "react-redux"
import Filter from './Filter'
import UnitsList from "./UnitsList"
import "../Home.css"
import { Redirect } from 'react-router-dom'
import NewDocument from '../document/NewDocument'
import Cookies from "js-cookie"

class Unit extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            docId: "",
            conf: JSON.parse(localStorage.getItem("configuration"))
        }

        if (Cookies.get("ViewOnlyToken") !== undefined) {
            props.dispatch({ type: "VIEW_ONLY", payload: true })
        }

        this.handleCreateDocument = this.handleCreateDocument.bind(this)
    }

    handleCreateDocument(id) {
        this.setState({ docId: id })
    }

    render() {
        if (this.state.conf === null)
            return (<Redirect to="/" />)

        if (this.state.docId !== "")
            return (<Redirect to={`/document?id=${this.state.docId}`} />)

        return (
            <>
                <Container>
                    <Row>
                        <Col>
                            <Filter />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 1 + "em" }}>
                        <Col>
                            <UnitsList />
                        </Col>
                    </Row>
                </Container>
                {
                    !this.props.viewOnly ?
                        <NewDocument handleCreateDocument={this.handleCreateDocument} />
                        :
                        null
                }
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        filter: state.filter,
        unitsView: state.unitsView,
        unitId: state.unitId,
        viewOnly: state.viewOnly
    }
}

export default connect(mapStateToProps)(Unit)