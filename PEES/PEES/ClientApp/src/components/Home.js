import React from 'react'
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap'
import { connect } from "react-redux"
import { Filter } from './Filter'
import { UnitsCard } from "./UnitsCard"
import { UnitsList } from "./UnitsList"
import "./Home.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const conf = JSON.parse(localStorage.getItem("configuration"))

class Home extends React.Component {
    static displayName = Home.name;

    constructor(props) {
        super(props)

        this.state = {
            modal: false,
            docName: "",
            year: "",
            semester: "",
            unit: "",
            season: "",
            type: "",
            firstSubmit: false
        }

        this.handleToggle = this.handleToggle.bind(this)
        this.handleCreateDocument = this.handleCreateDocument.bind(this)
    }

    handleToggle() {
        this.setState({ modal: false })
    }

    handleCreateDocument(e) {
        e.preventDefault()

        this.setState({firstSubmit: true})
    }

    render() {

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
                            {this.props.unitsView === "card" || this.props.unitId === "" ? <UnitsCard /> : <UnitsList />}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 1 + "em" }}>
                        <Col className="text-center">
                            <Button color="primary" onClick={() => this.setState({ modal: true })}><FontAwesomeIcon icon={faPlus} /><span style={{ paddingLeft: 0.5 + "em" }}>Novo enunciado</span></Button>
                        </Col>
                    </Row>
                </Container>
                <Modal isOpen={this.state.modal} toggle={this.handleToggle}>
                    <ModalHeader toggle={this.handleToggle}>Novo enunciado</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup row>
                                <Label for="txtDocName" sm={2}>Nome</Label>
                                <Col sm={10}>
                                    <Input type="text" id="txtDocName" onChange={(e) => this.setState({ docName: e.target.value })} invalid={this.state.docName === "" && this.state.firstSubmit}/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstYear" sm={2}>Ano</Label>
                                <Col sm={10}>
                                    <Input type="select" id="lstYear" onChange={(e) => this.setState({ year: e.target.value })} invalid={this.state.year === "" && this.state.firstSubmit}>
                                        <option value=""></option>
                                        {conf.curricularYears.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstSemester" sm={2}>Semestre</Label>
                                <Col sm={10}>
                                    <Input type="select" id="lstSemester" onChange={(e) => this.setState({ semester: e.target.value })} invalid={this.state.semester === "" && this.state.firstSubmit}>
                                        <option value=""></option>
                                        {conf.semesters.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstUnit" sm={2}>Disciplina</Label>
                                <Col sm={10}>
                                    <Input type="select" id="lstUnit" onChange={(e) => this.setState({ unit: e.target.value })} invalid={this.state.unit === "" && this.state.firstSubmit}>
                                        <option value=""></option>
                                        {conf.curricularUnits.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstSeason" sm={2}>Época</Label>
                                <Col sm={10}>
                                    <Input type="select" id="lstSeason" onChange={(e) => this.setState({ season: e.target.value })} invalid={this.state.season === "" && this.state.firstSubmit}>
                                        <option value=""></option>
                                        {conf.seasons.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstInstructionType" sm={2}>Tipo de enunciado</Label>
                                <Col sm={10}>
                                    <Input type="select" id="lstInstructionType" onChange={(e) => this.setState({ type: e.target.value })} invalid={this.state.type === "" && this.state.firstSubmit}>
                                        <option value=""></option>
                                        {conf.instructionTypes.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleCreateDocument}>Adicionar</Button>
                    </ModalFooter>
                </Modal>
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

export default connect(mapStateToProps)(Home)