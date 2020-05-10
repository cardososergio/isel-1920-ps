import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { Container, Row, Col, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, CustomInput, Collapse, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap"
import "./Document.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfo, faBars, faEye, faPlus, faTimes, faEllipsisV, faCaretUp, faCaretDown, faCircle } from "@fortawesome/free-solid-svg-icons"
import PouchDB from 'pouchdb'
import DatePicker from "react-datepicker"
import { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import pt from 'date-fns/locale/pt'
registerLocale('pt', pt)

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
            },
            default: {
                numeringType: 2
            }
        }

        this.toggle = this.toggle.bind(this)
        this.handleDetail = this.handleDetail.bind(this)
        this.handleNewCourse = this.handleNewCourse.bind(this)
        this.handleRemoveCourse = this.handleRemoveCourse.bind(this)

        this.handleNewQuestion = this.handleNewQuestion.bind(this)
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

    handleNewCourse() {
        const newCourse = document.getElementById("txtNewCourse").value
        if (newCourse === "") return

        document.getElementById("txtNewCourse").value = ""
        this.setState({ doc: { ...this.state.doc, header: { ...this.state.doc.header, courses: [...this.state.doc.header.courses, newCourse] } } })
    }

    handleRemoveCourse(pos) {
        const update = this.state.doc.header.courses
        delete update[pos]

        this.setState({ doc: { ...this.state.doc, header: { ...this.state.doc.header, courses: update } } })
    }

    handleNewQuestion() {
        const text = document.getElementById("txtNewQuestion").value
        if (text === "") return

        const question = {
            question_id: this.state.doc.questions.length + 1,
            numering_type: this.state.default.numeringType,
            numering: "0",
            grade: 0,
            text: text,
            position: this.state.doc.questions.length + 1
        }

        console.log(question)

        this.setState({ doc: { ...this.state.doc, questions: [...this.state.doc.questions, question] } })
        document.getElementById("txtNewQuestion").value = ""
    }

    createMarkup(text) {
        return { __html: text };
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
                    <Collapse isOpen={this.state.header.isOpen} className="row text-center" style={{ fontFamily: "Garamond", fontSize: 13 + "pt" }}>
                        <Col xs={{ size: 6, offset: 3 }} style={{ fontWeight: "bold" }}>
                            {this.state.doc.header.school_name}
                        </Col>
                        <Col xs={{ size: 6, offset: 3 }}>
                            {
                                this.state.doc.header.courses.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            {item}
                                            <span style={{ float: "right" }}><FontAwesomeIcon icon={faTimes} style={{ cursor: "pointer" }} onClick={() => this.handleRemoveCourse(index)} /></span>
                                        </div>
                                    )
                                })
                            }
                            <InputGroup>
                                <Input id="txtNewCourse" placeholder="Curso" className="text-center" bsSize="sm" autoComplete="off" />
                                <InputGroupAddon addonType="append" onClick={this.handleNewCourse} style={{ cursor: "pointer" }}>
                                    <InputGroupText><FontAwesomeIcon icon={faPlus} /></InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                        <Col xs={{ size: 6, offset: 3 }} style={{ fontWeight: "bold" }}>{conf.curricularUnits.find(item => item.id === this.state.doc.curricular_unit).value}</Col>
                        <Col xs={{ size: 6, offset: 3 }}>
                            <Input type="text" defaultValue={this.state.doc.header.description} className="text-center" placeholder="descritivo do enunciado" autoComplete="off"
                                onChange={(e) => this.setState({ doc: { ...this.state.doc, header: { ...this.state.doc.header, description: e.target.value } } })} />
                        </Col>
                        <Col xs={{ size: 6, offset: 3 }} style={{ marginTop: 5 + "px" }}>
                            <Input type="text" defaultValue={this.state.doc.header.delivery_note} className="text-center" placeholder="duração do teste/exame/trabalho" autoComplete="off"
                                onChange={(e) => this.setState({ doc: { ...this.state.doc, header: { ...this.state.doc.header, delivery_note: e.target.value } } })} />
                        </Col>
                    </Collapse>
                    <Row style={{ marginTop: 20 + "px", marginBottom: 10 + "px", fontFamily: "Garamond", fontSize: 13 + "pt" }}>
                        <Col>
                            {
                                this.state.doc.questions.map(item => {
                                    const totalQuestions = this.state.doc.questions.length

                                    return (
                                        <div key={item.question_id} style={{ display: "flex", marginTop: 5 + "px", marginBottom: 5 + "px", flexDirection: "column" }}>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ width: 25 + "px", textAlign: "end", marginRight: 5 + "px" }}>
                                                    {
                                                        item.numering_type === 2 ?
                                                            item.numering + "."
                                                            :
                                                            <ul><li></li></ul>
                                                    }
                                                </div>
                                                <div style={{ marginRight: 5 + "px" }}>
                                                    {
                                                        item.grade !== "" ?
                                                            "(" + item.grade.toString().replace(".", ",") + ")"
                                                            :
                                                            null
                                                    }
                                                </div>
                                                <div contentEditable="true" className="form-control-plaintext text-justify" spellCheck="false" dangerouslySetInnerHTML={this.createMarkup(item.text)}></div>
                                                <div className="question-options" style={{ display: "inherit", cursor: "pointer" }}>
                                                    <FontAwesomeIcon icon={faCaretUp} style={{ color: item.position !== 1 ? "#4da3ff" : null }} />
                                                    <FontAwesomeIcon icon={faCaretDown} style={{ color: item.position !== totalQuestions ? "#4da3ff" : null }} />
                                                    <FontAwesomeIcon icon={faEllipsisV} style={{ color: "#4da3ff" }} />
                                                </div>
                                            </div>
                                            <div style={{ marginLeft: 50 + "px" }}>
                                                <InputGroup style={{ marginTop: 5 + "px" }}>
                                                    <Input placeholder="Nova pergunta" autoComplete="off" bsSize="sm" />
                                                    <InputGroupAddon addonType="append" onClick={this.handleNewQuestion} style={{ cursor: "pointer" }}>
                                                        <InputGroupText><FontAwesomeIcon icon={faPlus} /></InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <InputGroup style={{ marginTop: 5 + "px" }}>
                                <Input id="txtNewQuestion" placeholder="Nova pergunta" autoComplete="off" />
                                <InputGroupAddon addonType="append" onClick={this.handleNewQuestion} style={{ cursor: "pointer" }}>
                                    <InputGroupText><FontAwesomeIcon icon={faPlus} /></InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
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
                                <Col sm={4}>
                                    <DatePicker className="form-control" locale="pt" selected={this.state.doc.release_date} showTimeSelect timeCaption="Horas" timeFormat="HH:mm" timeIntervals={30} dateFormat="yyyy/MM/dd HH:mm"
                                        onChange={(e) => this.setState({ doc: { ...this.state.doc, release_date: e } })} isClearable />
                                </Col>
                                <Label for="txtPublicDate" sm={2}>Data disponibilização</Label>
                                <Col sm={4}>
                                    <DatePicker className="form-control" locale="pt" selected={this.state.doc.public_date} showTimeSelect timeCaption="Horas" timeFormat="HH:mm" timeIntervals={30} dateFormat="yyyy/MM/dd HH:mm"
                                        onChange={(e) => this.setState({ doc: { ...this.state.doc, public_date: e } })} isClearable />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="txtDeliveryDate" sm={2}>Data entrega</Label>
                                <Col sm={4}>
                                    <DatePicker className="form-control" locale="pt" selected={this.state.doc.delivery_date} showTimeSelect timeCaption="Horas" timeFormat="HH:mm" timeIntervals={30} dateFormat="yyyy/MM/dd HH:mm"
                                        onChange={(e) => this.setState({ doc: { ...this.state.doc, delivery_date: e } })} isClearable />
                                </Col>
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
                </Modal>
            </>
        )
    }
}
export default connect()(Document)