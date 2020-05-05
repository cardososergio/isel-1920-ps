import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, CustomInput } from "reactstrap"
import { DocumentHeader } from "./DocumentHeader"
import "./Document.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faInfo, faBars, faEye } from "@fortawesome/free-solid-svg-icons"

const conf = JSON.parse(localStorage.getItem("configuration"))

class Document extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            modal: {
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

    render() {
        return (
            <>
                <Container fluid={true} className="document">
                    <Row className="header">
                        <Col xs="8">Nome do enunciado</Col>
                        <Col xs="4" className="text-right">
                            <Link to="" onClick={this.handleDetail}><FontAwesomeIcon icon={faInfo} /></Link>
                            <Link to="#" onClick={this.handleHeader}><FontAwesomeIcon icon={faBars} /></Link>
                            <Link to="#" onClick={this.handlePreview}><FontAwesomeIcon icon={faEye} /></Link>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ size: 6, offset: 3 }}>School name</Col>
                        <Col xs={{ size: 6, offset: 3 }}>Degree</Col>
                        <Col xs={{ size: 6, offset: 3 }}>Unit name</Col>
                        <Col xs={{ size: 6, offset: 3 }}>Description</Col>
                        <Col xs={{ size: 6, offset: 3 }}>Duration</Col>
                    </Row>
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
                        <Form autocomplete="off">
                            <FormGroup row>
                                <Label for="txtDocName" sm={2}>Nome</Label>
                                <Col sm={10}>
                                    <Input type="text" id="txtDocName" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstYear" sm={2}>Ano</Label>
                                <Col sm={4}>
                                    <Input type="select" id="lstYear">
                                        {conf.curricularYears.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                                <Label for="lstSemester" sm={2}>Semestre</Label>
                                <Col sm={4}>
                                    <Input type="select" id="lstSemester">
                                        {conf.semesters.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstUnit" sm={2}>Disciplina</Label>
                                <Col sm={4}>
                                    <Input type="select" id="lstUnit">
                                        {conf.curricularUnits.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                                <Label for="lstSeason" sm={2}>Época</Label>
                                <Col sm={4}>
                                    <Input type="select" id="lstSeason">
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
                                <Col sm={4}><Input type="number" id="txtDuration" /></Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="chkDraft" sm={2}>Rascunho</Label>
                                <Col sm={4}><CustomInput type="switch" id="chkDraft" label="" /></Col>
                                <Label for="chkPublic" sm={2}>Público</Label>
                                <Col sm={4}><CustomInput type="switch" id="chkPublic" label="" /></Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstInstructionType" sm={2}>Tipo</Label>
                                <Col sm={4}>
                                    <Input type="select" id="lstInstructionType">
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