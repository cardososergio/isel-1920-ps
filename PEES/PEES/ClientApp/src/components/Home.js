import React from 'react'
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap'
import { connect } from "react-redux"
import { Filter } from './Filter'
import { UnitsCard } from "./UnitsCard"
import { UnitsList } from "./UnitsList"
import "./Home.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import PouchDB from 'pouchdb'
import { Redirect } from 'react-router-dom'
import * as Constants from "../Constants"
import * as Utils from "./global/Utils"

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
            firstSubmit: false,
            docId: "",
            gotBackofficeChanges: false,
            noGo: true,
            conf: JSON.parse(localStorage.getItem("configuration"))
        }

        this.handleToggle = this.handleToggle.bind(this)
        this.handleCreateDocument = this.handleCreateDocument.bind(this)
    }

    componentDidMount() {

        if (localStorage.getItem("isOffline") === "true") {
            this.setState({ noGo: false })
            return
        }

        const _this = this;

        (async function () {
            const response2 = await fetch('/api/users/configuration')
            const data = await response2.json()

            // compare
            const localConfig = JSON.parse(localStorage.getItem("configuration"))
            const serverConfig = data

            // Curricular Units
            let gotChanges = !localConfig.curricularUnits.every(l => {
                return !(serverConfig.curricularUnits.find(s => l.id === s.id) === undefined || serverConfig.curricularUnits.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
            })

            // Curricular Year
            if (!gotChanges)
                gotChanges = !localConfig.curricularYears.every(l => {
                    return !(serverConfig.curricularYears.find(s => l.id === s.id) === undefined || serverConfig.curricularYears.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
                })

            // Semester
            if (!gotChanges)
                gotChanges = !localConfig.semesters.every(l => {
                    return !(serverConfig.semesters.find(s => l.id === s.id) === undefined || serverConfig.semesters.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
                })

            // Season
            if (!gotChanges)
                gotChanges = !localConfig.seasons.every(l => {
                    return !(serverConfig.seasons.find(s => l.id === s.id) === undefined || serverConfig.seasons.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
                })

            // Instruction Type
            if (!gotChanges)
                gotChanges = !localConfig.instructionTypes.every(l => {
                    return !(serverConfig.instructionTypes.find(s => l.id === s.id) === undefined || serverConfig.instructionTypes.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
                })

            if (!gotChanges)
                localStorage.setItem("configuration", JSON.stringify(serverConfig))
            else
                _this.props.dispatch({ type: "BACKOFFICE_DATA", payload: serverConfig })

            _this.setState({ gotBackofficeChanges: gotChanges })
            _this.props.dispatch({ type: "BACKOFFICE_VERSION_CONTROL", payload: gotChanges })

            PouchDB.replicate(Constants.URL_COUCHDB_OFFLINE, Constants.URL_COUCHDB);
            PouchDB.replicate(Constants.URL_COUCHDB, Constants.URL_COUCHDB_OFFLINE);

            _this.setState({ noGo: false })
        })()
    }

    handleToggle() {
        this.setState({ modal: false })
    }

    handleCreateDocument(e) {
        e.preventDefault()

        if (this.state.docName === "" || this.state.year === "" || this.state.semester === "" || this.state.unit === "" || this.state.season === "" || this.state.type === "") {
            this.setState({ firstSubmit: true })
            return
        }

        var doc = {
            user_id: JSON.parse(localStorage.getItem("user")).userId,
            instruction_type: this.state.type,
            name: this.state.docName,
            is_draft: true,
            is_public: false,
            curricular_year: this.state.year,
            semester: this.state.semester,
            curricular_unit: this.state.unit,
            season: this.state.season,
            duration: "",
            grade: "",
            header: {
                school_name: this.state.conf.schoolName,
                courses: []
            },
            questions: []
        }

        const db = new PouchDB(localStorage.getItem("isOffline") === "true" ? Constants.URL_COUCHDB_OFFLINE : Constants.URL_COUCHDB)
        db.post(doc)
            .then(response => {
                if (!response.ok) {
                    this.props.dispatch(Utils.Toast("Ocorreu um erro ao criar o enunciado", Utils.ToastTypes.Danger, true))
                    return
                }

                this.setState({ docId: response.id })
            })
            .catch(err => {
                console.error(err)
                this.props.dispatch(Utils.Toast("Ocorreu uma exceção na aplicação", Utils.ToastTypes.Danger, true))
            })
    }

    render() {
        if (this.state.noGo)
            return (<></>)

        if (this.state.gotBackofficeChanges)
            return (<Redirect to="/versioncontrol" />)

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
                            {
                                document.location.pathname.toLowerCase() !== "/unit" ?
                                    <UnitsCard />
                                    :
                                    <UnitsList />
                            }

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
                                    <Input type="text" id="txtDocName" onChange={(e) => this.setState({ docName: e.target.value })} invalid={this.state.docName === "" && this.state.firstSubmit} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstYear" sm={2}>Ano</Label>
                                <Col sm={10}>
                                    <Input type="select" id="lstYear" onChange={(e) => this.setState({ year: e.target.value })} invalid={this.state.year === "" && this.state.firstSubmit}>
                                        <option value=""></option>
                                        {this.state.conf.curricularYears.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstSemester" sm={2}>Semestre</Label>
                                <Col sm={10}>
                                    <Input type="select" id="lstSemester" onChange={(e) => this.setState({ semester: e.target.value })} invalid={this.state.semester === "" && this.state.firstSubmit}>
                                        <option value=""></option>
                                        {this.state.conf.semesters.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstUnit" sm={2}>Disciplina</Label>
                                <Col sm={10}>
                                    <Input type="select" id="lstUnit" onChange={(e) => this.setState({ unit: e.target.value })} invalid={this.state.unit === "" && this.state.firstSubmit}>
                                        <option value=""></option>
                                        {this.state.conf.curricularUnits.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstSeason" sm={2}>Época</Label>
                                <Col sm={10}>
                                    <Input type="select" id="lstSeason" onChange={(e) => this.setState({ season: e.target.value })} invalid={this.state.season === "" && this.state.firstSubmit}>
                                        <option value=""></option>
                                        {this.state.conf.seasons.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstInstructionType" sm={2}>Tipo de enunciado</Label>
                                <Col sm={10}>
                                    <Input type="select" id="lstInstructionType" onChange={(e) => this.setState({ type: e.target.value })} invalid={this.state.type === "" && this.state.firstSubmit}>
                                        <option value=""></option>
                                        {this.state.conf.instructionTypes.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
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
        unitId: state.unitId,
        gotBackofficeChanges: state.gotBackofficeChanges
    }
}

export default connect(mapStateToProps,)(Home)