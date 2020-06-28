import React, { useState } from "react"
import { connect } from "react-redux"
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Container, Row } from 'reactstrap'
import PouchDB from 'pouchdb'
import * as Constants from "../global/Constants"
import * as Utils from "../global/Utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

const NewDocument = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [firstSubmit, setFirstSubmit] = useState(false)
    const conf = JSON.parse(localStorage.getItem("configuration"))
    const [docName, setDocName] = useState("")
    const [year, setYear] = useState("")
    const [semester, setSemester] = useState("")
    const [unit, setUnit] = useState("")
    const [season, setSeason] = useState("")
    const [type, setType] = useState("")

    const handleToggle = () => {
        setIsOpen(!isOpen)
    }

    const handleCreateDocument = (e) => {
        e.preventDefault()

        if (docName === "" || year === "" || semester === "" || unit === "" || season === "" || type === "") {
            setFirstSubmit(true)
            return
        }

        var doc = {
            user_id: JSON.parse(localStorage.getItem("user")).userId,
            instruction_type: type,
            name: docName,
            is_draft: true,
            is_public: false,
            curricular_year: year,
            semester: semester,
            curricular_unit: unit,
            season: season,
            duration: "",
            grade: "",
            header: {
                school_name: conf.schoolName,
                courses: []
            },
            questions: []
        }

        const db = new PouchDB(localStorage.getItem("isOffline") === "true" ? Constants.URL_COUCHDB_OFFLINE : Constants.URL_COUCHDB)
        db.post(doc)
            .then(response => {
                if (!response.ok) {
                    props.dispatch(Utils.Toast("Ocorreu um erro ao criar o enunciado", Utils.ToastTypes.Danger, true))
                    return
                }

                props.handleCreateDocument(response.id)
            })
            .catch(err => {
                console.error(err)
                props.dispatch(Utils.Toast("Ocorreu uma exceção na aplicação", Utils.ToastTypes.Danger, true))
            })
    }

    return (
        <>
            <Container>
                <Row style={{ marginTop: 1 + "em" }}>
                    <Col className="text-center">
                        <Button color="primary" onClick={() => handleToggle()}><FontAwesomeIcon icon={faPlus} /><span style={{ paddingLeft: 0.5 + "em" }}>Novo enunciado</span></Button>
                    </Col>
                </Row>
            </Container>
            <Modal isOpen={isOpen} toggle={handleToggle}>
                <ModalHeader toggle={handleToggle}>Novo enunciado</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label for="txtDocName" sm={2}>Nome</Label>
                            <Col sm={10}>
                                <Input type="text" id="txtDocName" onChange={(e) => setDocName(e.target.value)} invalid={docName === "" && firstSubmit} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="lstYear" sm={2}>Ano</Label>
                            <Col sm={10}>
                                <Input type="select" id="lstYear" onChange={(e) => setYear(e.target.value)} invalid={year === "" && firstSubmit}>
                                    <option value=""></option>
                                    {conf.curricularYears.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="lstSemester" sm={2}>Semestre</Label>
                            <Col sm={10}>
                                <Input type="select" id="lstSemester" onChange={(e) => setSemester(e.target.value)} invalid={semester === "" && firstSubmit}>
                                    <option value=""></option>
                                    {conf.semesters.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="lstUnit" sm={2}>Disciplina</Label>
                            <Col sm={10}>
                                <Input type="select" id="lstUnit" onChange={(e) => setUnit(e.target.value)} invalid={unit === "" && firstSubmit}>
                                    <option value=""></option>
                                    {conf.curricularUnits.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="lstSeason" sm={2}>Época</Label>
                            <Col sm={10}>
                                <Input type="select" id="lstSeason" onChange={(e) => setSeason(e.target.value)} invalid={season === "" && firstSubmit}>
                                    <option value=""></option>
                                    {conf.seasons.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="lstInstructionType" sm={2}>Tipo de enunciado</Label>
                            <Col sm={10}>
                                <Input type="select" id="lstInstructionType" onChange={(e) => setType(e.target.value)} invalid={type === "" && firstSubmit}>
                                    <option value=""></option>
                                    {conf.instructionTypes.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                </Input>
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleCreateDocument}>Adicionar</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default connect()(NewDocument)
