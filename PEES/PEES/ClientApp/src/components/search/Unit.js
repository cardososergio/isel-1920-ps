import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { connect } from "react-redux"
import Filter from './Filter'
import UnitsList from "./UnitsList"
import "../Home.css"
import { Redirect } from 'react-router-dom'
import NewDocument from '../document/NewDocument'

class Unit extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            docId: "",
            conf: JSON.parse(localStorage.getItem("configuration"))
        }

        this.handleCreateDocument = this.handleCreateDocument.bind(this)
    }

    handleCreateDocument(id) {
        this.setState({ docId: id })
    }

    render() {
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
                <NewDocument handleCreateDocument={this.handleCreateDocument} />
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        filter: state.filter,
        unitsView: state.unitsView,
        unitId: state.unitId
    }
}

export default connect(mapStateToProps)(Unit)