import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, CustomInput, Collapse } from "reactstrap"
import "./Document.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faInfo, faBars, faEye } from "@fortawesome/free-solid-svg-icons"
import PouchDB from 'pouchdb'

const conf = JSON.parse(localStorage.getItem("configuration"))

class Document extends React.Component {
    constructor(props) {
        super(props)

        const params = new URLSearchParams(document.location.search);

        this.state = {
            loading: true,
            id: params.get("id"),
            doc: undefined,
            modal: {
                isOpen: false
            },
            header: {
                isOpen: false
            }
        }

        this.toggle = this.toggle.bind(this)
        this.handleDetail = this.handleDetail.bind(this)
    }

    toggle() {
        this.setState({ modal: { ...this.state.modal, isOpen: !this.state.modal.isOpen } })
    }

    handleDetail = (e) => {
        e.preventDefault()

        this.toggle()
    }

    handleHeader = (e) => {
        e.preventDefault()

        this.setState({ header: { isOpen: !this.state.header.isOpen } })
    }

    componentDidMount() {
        const db = new PouchDB("http://127.0.0.1:5984/pees")

        db.get(this.state.id)
            .then(doc => {
                console.log(doc)
                // change curricular unit id for name
                doc.header.curricular_unit = conf.curricularUnits.find(item => item.id === doc.curricular_unit).value

                this.setState({ doc: doc, loading: false })

            }).catch(error => {
                console.error(error)
            })
    }

    render() {
        if (this.state.loading)
            return (<></>)

        return (
            <>
                <Container fluid={true} className="document">
                    <Row className="header">
                        <Col xs="8">{this.state.doc.name}</Col>
                        <Col xs="4" className="text-right">
                            <Link to="" onClick={this.handleDetail}><FontAwesomeIcon icon={faInfo} /></Link>
                            <Link to="" onClick={this.handleHeader}><FontAwesomeIcon icon={faBars} /></Link>
                            <Link to="#" onClick={this.handlePreview}><FontAwesomeIcon icon={faEye} /></Link>
                        </Col>
                    </Row>
                    <Collapse isOpen={this.state.header.isOpen} className="row">
                        <Col xs={{ size: 6, offset: 3 }}>{this.state.doc.header.school_name}</Col>
                        <Col xs={{ size: 6, offset: 3 }}>Courses</Col>
                        <Col xs={{ size: 6, offset: 3 }}>{conf.curricularUnits.find(item => item.id === this.state.doc.curricular_unit).value}</Col>
                        <Col xs={{ size: 6, offset: 3 }}>{this.state.doc.header.description}</Col>
                        <Col xs={{ size: 6, offset: 3 }}>{this.state.doc.header.delivery_note}</Col>
                    </Collapse>
                    <Row>
                        <Col>Questions</Col>
                    </Row>
                    <Row>
                        <Col>References</Col>
                    </Row>
                </Container>
                <Modal isOpen={this.state.modal.isOpen} toggle={this.toggle} backdrop="static" keyboard={false} size="lg">
                    <ModalHeader toggle={this.toggle}>Detalhe</ModalHeader>
                    <ModalBody>
                        <Form autoComplete="off">
                            <FormGroup row>
                                <Label for="txtDocName" sm={2}>Nome</Label>
                                <Col sm={10}>
                                    <Input type="text" id="txtDocName" value={this.state.doc.name} onChange={(e) => this.setState({ doc: { ...this.state.doc, name: e.target.value } })} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstYear" sm={2}>Ano</Label>
                                <Col sm={4}>
                                    <Input type="select" id="lstYear" value={this.state.doc.curricular_year} onChange={(e) => this.setState({ doc: { ...this.state.doc, curricular_year: e.target.value } })}>
                                        {conf.curricularYears.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                                <Label for="lstSemester" sm={2}>Semestre</Label>
                                <Col sm={4}>
                                    <Input type="select" id="lstSemester" value={this.state.doc.semester} onChange={(e) => this.setState({ doc: { ...this.state.doc, semester: e.target.value } })}>
                                        {conf.semesters.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstUnit" sm={2}>Disciplina</Label>
                                <Col sm={4}>
                                    <Input type="select" id="lstUnit" value={this.state.doc.curricular_unit} onChange={(e) => this.setState({ doc: { ...this.state.doc, curricular_unit: e.target.value } })}>
                                        {conf.curricularUnits.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                                <Label for="lstSeason" sm={2}>Época</Label>
                                <Col sm={4}>
                                    <Input type="select" id="lstSeason" value={this.state.doc.season} onChange={(e) => this.setState({ doc: { ...this.state.doc, season: e.target.value } })}>
                                        {conf.seasons.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="txtReleaseDate" sm={2}>Data publicação</Label>
                                <Col sm={4}><Input type="datetime-local" id="txtReleaseDate" /></Col>
                                <Label for="txtPublicDate" sm={2}>Data disponibilização</Label>
                                <Col sm={4}><Input type="datetime-local" id="txtPublicDate" /></Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="txtDeliveryDate" sm={2}>Data entrega</Label>
                                <Col sm={4}><Input type="datetime-local" id="txtDeliveryDate" /></Col>
                                <Label for="txtDuration" sm={2}>Duração</Label>
                                <Col sm={4}>
                                    <Input type="number" id="txtDuration" value={this.state.doc.duration} onChange={(e) => this.setState({ doc: { ...this.state.doc, duration: e.target.value } })} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="chkDraft" sm={2}>Rascunho</Label>
                                <Col sm={4}><CustomInput type="switch" id="chkDraft" label="" checked={this.state.doc.is_draft} onChange={(e) => this.setState({ doc: { ...this.state.doc, is_draft: e.target.checked } })} /></Col>
                                <Label for="chkPublic" sm={2}>Público</Label>
                                <Col sm={4}><CustomInput type="switch" id="chkPublic" label="" checked={this.state.doc.is_public} onChange={(e) => this.setState({ doc: { ...this.state.doc, is_public: e.target.checked } })} /></Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstInstructionType" sm={2}>Tipo</Label>
                                <Col sm={4}>
                                    <Input type="select" id="lstInstructionType" value={this.state.doc.instruction_type} onChange={(e) => this.setState({ doc: { ...this.state.doc, instruction_type: e.target.value } })}>
                                        {conf.instructionTypes.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary"><FontAwesomeIcon icon={faSave} style={{ paddingRight: 0.2 + "em" }} /> Gravar</Button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}
export default connect()(Document)