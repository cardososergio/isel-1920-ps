﻿import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import {
    Container, Row, Col, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, CustomInput, Collapse, InputGroup,
    InputGroupAddon, InputGroupText, ModalFooter, Button, UncontrolledPopover, PopoverBody, CardDeck, CardBody, Card, CardTitle
} from "reactstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfo, faBars, faEye, faPlus, faTimes, faEllipsisV, faCaretUp, faCaretDown, faTrash, faCheck, faBold, faItalic, faUnderline, faSuperscript, faSubscript, faFilePdf, faFile, faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import PouchDB from 'pouchdb'
import DatePicker from "react-datepicker"
import { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import pt from 'date-fns/locale/pt'
import uuid4 from 'uuid4'
import "./Document.css"
import * as Constants from "../global/Constants"
import * as Utils from "../global/Utils"

registerLocale('pt', pt)

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
            modalQuestion: {
                isOpen: false,
                id: 0,
                fields: {
                    numeringType: 1,
                    numering: 0,
                    grade: 0,
                    footerNote: ""
                },
                subQuestion: false,
                mainId: 0
            },
            header: {
                isOpen: false
            },
            default: {
                numeringType: 2
            },
            popover: {
                isOpen: false,
                control: "body",
                startSel: 0,
                endSel: 0,
                id: 0,
                type: "main"
            },
            modalVersions: {
                isOpen: false,
                revisions: []
            },
            attachments: [],
            conf: JSON.parse(localStorage.getItem("configuration"))
        }

        this.toggle = this.toggle.bind(this)
        this.toggleQuestion = this.toggleQuestion.bind(this)
        this.toggleVersions = this.toggleVersions.bind(this)

        this.handleDetail = this.handleDetail.bind(this)
        this.handleNewCourse = this.handleNewCourse.bind(this)
        this.handleRemoveCourse = this.handleRemoveCourse.bind(this)

        this.handleChangeTextQuestion = this.handleChangeTextQuestion.bind(this)

        this.handleNewQuestion = this.handleNewQuestion.bind(this)
        this.handleChangeQuestion = this.handleChangeQuestion.bind(this)
        this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this)

        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleFormat = this.handleFormat.bind(this)
        this.handleSaveDocument = this.handleSaveDocument.bind(this)

        this.handleViewVersion = this.handleViewVersion.bind(this)
        this.handleViewRevision = this.handleViewRevision.bind(this)
        this.handleChangeRevision = this.handleChangeRevision.bind(this)

        this.handleAddAttach = this.handleAddAttach.bind(this)
    }

    toggle() {
        this.setState({ modal: { ...this.state.modal, isOpen: !this.state.modal.isOpen } })
    }
    toggleQuestion() {
        this.setState({ modalQuestion: { ...this.state.modalQuestion, isOpen: !this.state.modalQuestion.isOpen } })
    }
    toggleVersions() {
        this.setState({ modalVersions: { ...this.state.modalVersions, isOpen: !this.state.modalVersions.isOpen } })
    }

    createMarkup(text) {
        return { __html: text }
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
        const db = new PouchDB(localStorage.getItem("isOffline") === "true" ? Constants.URL_COUCHDB_OFFLINE : Constants.URL_COUCHDB)

        db.get(this.state.id, { attachments: true })
            .then(doc => {
                // change curricular unit id for name
                doc.header.curricular_unit = this.state.conf.curricularUnits.find(item => item.id === doc.curricular_unit).value

                // attach
                let attach = []
                if (doc._attachments !== undefined) {
                    for (var prop in doc._attachments) {
                        attach.push({
                            filename: prop, new: false,
                            data: doc._attachments[prop].data,
                            content_type: doc._attachments[prop].content_type,
                            url: URL.createObjectURL(b64toBlob(doc._attachments[prop].data, doc._attachments[prop].content_type))
                        })
                    }
                }

                this.setState({ doc: doc, loading: false, attachments: attach })

            }).catch(error => {
                console.error(error)
                this.props.dispatch(Utils.Toast("Houve uma exceção na aplicação!", Utils.ToastTypes.Danger, true))
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

    handleNewQuestion(id) {
        const subQuestion = (id !== undefined)

        const text = !subQuestion ? document.getElementById("txtNewQuestion").value : document.getElementById("txtSubNewQuestion" + id).value
        if (text === "") return

        let position
        if (!subQuestion) {
            position = this.state.doc.questions.length + 1
        }
        else {
            const sub = this.state.doc.questions.find(item => item.question_id === id).questions
            if (sub !== undefined)
                position = sub.length + 1
            else
                position = 1
        }

        const question = {
            question_id: uuid4(),
            numering_type: this.state.default.numeringType,
            numering: this.state.default.numeringType === 2 ? "0" : "",
            grade: this.state.default.numeringType === 2 ? "0" : "",
            text: String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
            position: position
        }

        if (!subQuestion) {
            this.setState({ doc: { ...this.state.doc, questions: [...this.state.doc.questions, question] } })
        }
        else {
            let update = this.state.doc.questions.find(item => item.question_id === id)

            let sub = update.questions
            if (sub === undefined) sub = []
            sub.push(question)

            update.questions = sub

            let mainQuestions = this.state.doc.questions.filter(item => item.question_id !== id)
            mainQuestions.push(update)

            this.setState({ doc: { ...this.state.doc, questions: mainQuestions } })
        }

        if (!subQuestion)
            document.getElementById("txtNewQuestion").value = ""
        else
            document.getElementById("txtSubNewQuestion" + id).value = ""
    }

    handleOpenQuestion(id, subQuestion, mainId) {

        let question
        if (!subQuestion)
            question = this.state.doc.questions.find(item => item.question_id === id)
        else
            question = this.state.doc.questions.find(item => item.question_id === mainId).questions.find(item => item.question_id === id)

        const modal = {
            isOpen: true,
            id: id,
            fields: {
                numeringType: question.numering_type,
                numering: question.numering,
                grade: question.grade.replace(",", "."),
                footerNote: question.footer_note !== undefined ? question.footer_note : ""
            },
            subQuestion: subQuestion,
            mainId: mainId
        }

        this.setState({ modalQuestion: modal })
    }

    handleChangeQuestion() {

        const numeringType = this.state.modalQuestion.fields.numeringType
        let numering = 0
        let grade = 0

        if (numeringType === 2) {
            numering = this.state.modalQuestion.fields.numering * 1
            if (Number.isNaN(numering) || numering < 0) {
                this.props.dispatch(Utils.Toast("Numeração inválida!", Utils.ToastTypes.Warning, false))
                return
            }

            if (numering.toString().indexOf(".") !== -1) {
                if (numering.toString().split(".")[1].length > 2)
                    numering = parseFloat(numering).toFixed(2)
            }
        }

        grade = this.state.modalQuestion.fields.grade * 1
        if (Number.isNaN(grade) || grade < 0) {
            this.props.dispatch(Utils.Toast("Cotação inválida!", Utils.ToastTypes.Warning, false))
            return
        }

        if (grade.toString().indexOf(".") !== -1) {
            if (grade.toString().split(".")[1].length > 2)
                grade = parseFloat(grade).toFixed(2)
        }

        const pos = !this.state.modalQuestion.subQuestion ?
            this.state.doc.questions.findIndex(item => item.question_id === this.state.modalQuestion.id)
            :
            this.state.doc.questions.find(item => item.question_id === this.state.modalQuestion.mainId).questions.findIndex(item => item.question_id === this.state.modalQuestion.id)

        if (!this.state.modalQuestion.subQuestion) {
            let update = this.state.doc.questions
            update[pos].numering_type = numeringType
            update[pos].numering = numering === 0 && numeringType === 1 ? "" : numering.toString()
            update[pos].grade = grade === 0 ? "" : grade.toString()
            update[pos].footer_note = this.state.modalQuestion.fields.footerNote

            this.setState({ doc: { ...this.state.doc, questions: update }, default: { ...this.state.default, numeringType: update[pos].numering_type } })
        }
        else {
            let update = this.state.doc.questions.find(item => item.question_id === this.state.modalQuestion.mainId)
            let subUpdate = update.questions

            subUpdate[pos].numering_type = numeringType
            subUpdate[pos].numering = numering === 0 && numeringType === 1 ? "" : numering.toString()
            subUpdate[pos].grade = grade === 0 ? "" : grade.toString()
            update.questions = subUpdate

            const qIndex = this.state.doc.questions.findIndex(item => item.question_id === this.state.modalQuestion.mainId)
            let questions = this.state.doc.questions
            questions[qIndex] = update

            this.setState({ doc: { ...this.state.doc, questions: questions }, default: { ...this.state.default, numeringType: numeringType } })
        }

        this.toggleQuestion()
    }

    handleDeleteQuestion() {
        if (!window.confirm("A pergunta será eliminada. Deseja continuar?"))
            return

        if (!this.state.modalQuestion.subQuestion) {
            const delPosition = this.state.doc.questions.find(item => item.question_id === this.state.modalQuestion.id).position

            let update = this.state.doc.questions.filter(item => item.question_id !== this.state.modalQuestion.id).map(item => {
                if (item.position > delPosition) {
                    const newPos = item.position - 1
                    return { ...item, position: newPos }
                }

                return item
            })

            this.setState({ doc: { ...this.state.doc, questions: update } })
        }
        else {
            let update = this.state.doc.questions

            const pos = update.findIndex(item => item.question_id === this.state.modalQuestion.mainId)
            const delPosition = update[pos].questions.find(item => item.question_id === this.state.modalQuestion.id).position

            const subUpdate = update[pos].questions.filter(item => item.question_id !== this.state.modalQuestion.id).map(item => {
                if (item.position > delPosition) {
                    const newPos = item.position - 1
                    return { ...item, position: newPos }
                }

                return item
            })

            update[pos].questions = subUpdate

            this.setState({ doc: { ...this.state.doc, questions: update } })
        }

        this.toggleQuestion()
    }

    handleMoveQuestionUp(id) {

        let current = this.state.doc.questions.find(item => item.question_id === id)
        if (current.position === 1) return

        let prev = this.state.doc.questions.find(item => item.position === (current.position - 1))
        prev.position++

        current.position--

        let update = this.state.doc.questions.filter(item => item.question_id !== current.question_id && item.question_id !== prev.question_id)
        update.push(current)
        update.push(prev)

        this.setState({ doc: { ...this.state.doc, questions: update } })
    }

    handleMoveQuestionDown(id) {

        const totalQuestions = this.state.doc.questions.length
        let current = this.state.doc.questions.find(item => item.question_id === id)
        if (current.position === totalQuestions) return

        let next = this.state.doc.questions.find(item => item.position === (current.position + 1))
        next.position--

        current.position++

        let update = this.state.doc.questions.filter(item => item.question_id !== current.question_id && item.question_id !== next.question_id)
        update.push(current)
        update.push(next)

        this.setState({ doc: { ...this.state.doc, questions: update } })
    }

    handleMoveSubQuestionUp(mainId, id) {

        let current = this.state.doc.questions.find(item => item.question_id === mainId).questions.find(item => item.question_id === id)
        if (current.position === 1) return

        let prev = this.state.doc.questions.find(item => item.question_id === mainId).questions.find(item => item.position === (current.position - 1))
        prev.position++

        current.position--

        let subUpdate = this.state.doc.questions.find(item => item.question_id === mainId).questions.filter(item => item.question_id !== current.question_id && item.question_id !== prev.question_id)
        subUpdate.push(current)
        subUpdate.push(prev)

        const update = this.state.doc.questions.map(item => {
            if (item.question_id === mainId)
                return { ...item, questions: subUpdate }
            return item
        })

        this.setState({ doc: { ...this.state.doc, questions: update } })
    }

    handleMoveSubQuestionDown(mainId, id) {

        const totalQuestions = this.state.doc.questions.find(item => item.question_id === mainId).questions.length
        let current = this.state.doc.questions.find(item => item.question_id === mainId).questions.find(item => item.question_id === id)
        if (current.position === totalQuestions) return

        let next = this.state.doc.questions.find(item => item.question_id === mainId).questions.find(item => item.position === (current.position + 1))
        next.position--

        current.position++

        let subUpdate = this.state.doc.questions.find(item => item.question_id === mainId).questions.filter(item => item.question_id !== current.question_id && item.question_id !== next.question_id)
        subUpdate.push(current)
        subUpdate.push(next)

        const update = this.state.doc.questions.map(item => {
            if (item.question_id === mainId)
                return { ...item, questions: subUpdate }
            return item
        })

        this.setState({ doc: { ...this.state.doc, questions: update } })
    }

    handleChangeTextQuestion(e, id, mainId) {

        if (mainId === undefined) {
            const update = this.state.doc.questions.map(item => {
                if (item.question_id === id)
                    return { ...item, text: e.target.innerHTML }
                return item
            })

            this.setState({ doc: { ...this.state.doc, questions: update } })
        }
        else {
            const subUpdate = this.state.doc.questions.find(item => item.question_id === mainId).questions.map(item => {
                if (item.question_id === id)
                    return { ...item, text: e.target.innerHTML }
                return item
            })

            const update = this.state.doc.questions.map(item => {
                if (item.question_id === mainId)
                    return { ...item, questions: subUpdate }
                return item
            })

            this.setState({ doc: { ...this.state.doc, questions: update } })
        }
    }

    handleMouseUp(e, id, type, mainId) {

        if (window.getSelection().toString()) {

            /*const text = document.getElementById("divQuestion" + id).textContent || document.getElementById("divQuestion" + id).innerText

            let sibling = window.getSelection().anchorNode
            let str = ""
            do {
                if (sibling.wholeText !== undefined)
                    str = sibling.wholeText + str
                else
                    str = "<" + sibling.tagName + ">" + sibling.innerHTML + "</" + sibling.tagName + ">" + str

                sibling = sibling.previousSibling
            }
            while (sibling !== null)*/

            //return

            this.setState({
                popover: {
                    isOpen: true,
                    control: e.target.id,
                    startSel: window.getSelection().anchorOffset > window.getSelection().focusOffset ? window.getSelection().focusOffset : window.getSelection().anchorOffset,
                    endSel: window.getSelection().focusOffset < window.getSelection().anchorOffset ? window.getSelection().anchorOffset : window.getSelection().focusOffset,
                    id: id,
                    type: type,
                    mainId: mainId === undefined ? id : mainId
                }
            })
        }
        else {
            if (this.state.popover.isOpen) {
                window.getSelection().empty()

                this.setState({ popover: { ...this.state.popover, isOpen: false } })
            }
        }
    }

    handleFormat(format) {
        const startSel = this.state.popover.startSel
        const endSel = this.state.popover.endSel

        let question = []
        if (this.state.popover.type === "main" || this.state.popover.type === "footer")
            question = this.state.doc.questions.find(item => item.question_id === this.state.popover.id)
        else
            question = this.state.doc.questions.find(item => item.question_id === this.state.popover.mainId).questions.find(item => item.question_id === this.state.popover.id)

        let text = this.state.popover.type === "footer" ? question.footer_note : question.text
        let newText = text.slice(0, startSel) + "<" + format + ">" + text.slice(startSel, endSel) + "</" + format + ">" + text.slice(endSel)

        if (this.state.popover.type === "footer")
            question.footer_note = newText
        else
            question.text = newText

        let update
        if (this.state.popover.type !== "sub") {
            update = this.state.doc.questions.filter(item => item.question_id !== this.state.popover.id)
            update.push(question)
        }
        else {
            let subUpdate = this.state.doc.questions.find(item => item.question_id === this.state.popover.mainId).questions.filter(item => item.question_id !== this.state.popover.id)
            subUpdate.push(question)

            update = this.state.doc.questions.map(item => {
                if (item.question_id === this.state.popover.mainId)
                    return { ...item, questions: subUpdate }
                return item
            })
        }

        window.getSelection().empty()

        this.setState({ doc: { ...this.state.doc, questions: update }, popover: { isOpen: false, control: "body", startSel: 0, endSel: 0, id: 0, mainId: 0, type: "main" } })
    }

    handleSaveDocument() {
        const db = new PouchDB(localStorage.getItem("isOffline") === "true" ? Constants.URL_COUCHDB_OFFLINE : Constants.URL_COUCHDB)
        const _this = this

        let doc = this.state.doc

        // attach
        doc._attachments = {}

        _this.state.attachments.forEach(item => {
            if (item.delete)
                return

            const filename = item.filename

            doc._attachments[filename] = {
                content_type: item.content_type,
                data: item.data
            }
        })

        db.get(doc._id).then(function (doc2) {
            doc._rev = doc2._rev

            db.put(doc)
                .then(function (response) {
                    if (response.ok) {
                        _this.setState({ doc: { ...doc, _rev: response.rev } })

                        _this.props.dispatch(Utils.Toast("Enunciado gravado!", Utils.ToastTypes.Info, false))
                    }

                }).catch(function (err) {
                    console.error(err)
                });

        }).catch(function (err) {
            console.error(err)
        });
    }

    handleViewRevision(e, revisionId) {
        e.preventDefault()

        window.open("/preview?id=" + this.state.id + "&revision=" + revisionId)
    }

    handleChangeRevision(e, revisionId) {
        e.preventDefault()

        const db = new PouchDB(localStorage.getItem("isOffline") === "true" ? Constants.URL_COUCHDB_OFFLINE : Constants.URL_COUCHDB)
        const _this = this

        let _doc = _this.state.doc

        db.get(_this.state.id, { rev: revisionId }).then(function (doc) {
            if (revisionId === _this.state.doc._rev)
                doc = _doc
            else
                _doc = doc

            doc._rev = _this.state.modalVersions.revisions[0]

            return db.put(doc)
        }).then(function (response) {
            if (!response.ok) {
                _this.props.dispatch(Utils.Toast("Não foi possível gravar o enunciado!", Utils.ToastTypes.Warning, false))
                return
            }

            _this.setState({ doc: { ..._doc, _rev: response.rev }, modalVersions: { ..._this.state.modalVersions, isOpen: false } })

            _this.props.dispatch(Utils.Toast("Enunciado gravado!", Utils.ToastTypes.Info, false))
        }).catch(function (err) {
            console.log(err)
        });
    }

    handleAddAttach = (e) => {
        const file = e.target.files[0]

        if (file.type !== "application/pdf") {
            this.props.dispatch(Utils.Toast("Só é permitido selecionar ficheiros PDF!", Utils.ToastTypes.Warning, false))
            return
        }

        let update = this.state.attachments

        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)

        fileReader.onload = (e) => {
            update.push({ filename: file.name, data: fileReader.result.split(",")[1], url: URL.createObjectURL(file), content_type: file.type, new: true })

            this.setState({ attachments: update })
        }
    }

    handleDeleteAttach(pos, e) {
        e.stopPropagation()

        const update = this.state.attachments.map((item, index) => {
            if (index === pos)
                item.delete = true
            return item
        })

        this.setState({ attachments: update })
    }

    handleViewVersion = (e) => {
        e.preventDefault()

        const db = new PouchDB(localStorage.getItem("isOffline") === "true" ? Constants.URL_COUCHDB_OFFLINE : Constants.URL_COUCHDB)
        const _this = this
        const doc = this.state.doc

        db.get(doc._id, { revs: true })
            .then(newDoc => {
                let count = newDoc._revisions.start
                let revs = []
                let max = 1
                newDoc._revisions.ids.forEach(item => {
                    if (max <= 10) {
                        revs.push(count + "-" + item)
                        count--
                    }

                    max++
                })

                _this.setState({
                    modalVersions: {
                        ..._this.state.modalVersions, revisions: revs
                    }
                })

                _this.toggleVersions()
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
                            <Link to="" onClick={this.handleDetail} title="Detalhe"><FontAwesomeIcon icon={faInfo} /></Link>
                            <Link to="" onClick={this.handleHeader} title="Cabeçalho"><FontAwesomeIcon icon={faBars} /></Link>
                            <Link to={`/pdf?id=${this.state.id}`} target="_blank" title="Gerar PDF"><FontAwesomeIcon icon={faFilePdf} /></Link>
                            <Link to="" onClick={this.handleViewVersion} title="Visualizar versions"><FontAwesomeIcon icon={faEye} /></Link>
                        </Col>
                    </Row>
                    <Collapse isOpen={this.state.header.isOpen} className="row text-center font">
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
                        <Col xs={{ size: 6, offset: 3 }} style={{ fontWeight: "bold" }}>{this.state.conf.curricularUnits.find(item => item.id === this.state.doc.curricular_unit).value}</Col>
                        <Col xs={{ size: 6, offset: 3 }}>
                            <Input type="text" defaultValue={this.state.doc.header.description} className="text-center" placeholder="descritivo do enunciado" autoComplete="off"
                                onChange={(e) => this.setState({ doc: { ...this.state.doc, header: { ...this.state.doc.header, description: e.target.value } } })} />
                        </Col>
                        <Col xs={{ size: 6, offset: 3 }} style={{ marginTop: 5 + "px" }}>
                            <Input type="text" defaultValue={this.state.doc.header.delivery_note} className="text-center" placeholder="duração do teste/exame/trabalho" autoComplete="off"
                                onChange={(e) => this.setState({ doc: { ...this.state.doc, header: { ...this.state.doc.header, delivery_note: e.target.value } } })} />
                        </Col>
                    </Collapse>
                    <Row className="font row-margin">
                        <Col>
                            {
                                this.state.doc.questions.sort((a, b) => a.position - b.position).map(item => {
                                    const totalQuestions = this.state.doc.questions.length

                                    return (
                                        <div key={item.question_id} className="row-question">
                                            <div className="row-flex">
                                                <div className="div-numering">
                                                    {item.numering_type === 2 ? item.numering + "." : <ul style={{ marginBottom: 0 }}><li></li></ul>}
                                                </div>
                                                <div style={{ marginRight: 5 + "px" }}>
                                                    {item.grade !== "" ? "(" + item.grade.toString().replace(".", ",") + "%)" : null}
                                                </div>
                                                <div contentEditable="true" className="form-control-plaintext text-justify form-control" spellCheck="false"
                                                    onMouseUp={(e) => this.handleMouseUp(e, item.question_id, "main")} id={`divQuestion${item.question_id}`}
                                                    dangerouslySetInnerHTML={this.createMarkup(item.text)} style={{ height: "inherit" }}
                                                    onBlur={(e) => this.handleChangeTextQuestion(e, item.question_id)}></div>
                                                <div className="question-options" style={{ display: "inherit" }}>
                                                    <FontAwesomeIcon icon={faCaretUp} style={{ color: item.position !== 1 ? "#4da3ff" : null, cursor: "pointer" }}
                                                        onClick={() => this.handleMoveQuestionUp(item.question_id)} />
                                                    <FontAwesomeIcon icon={faCaretDown} style={{ color: item.position !== totalQuestions ? "#4da3ff" : null, cursor: "pointer" }}
                                                        onClick={() => this.handleMoveQuestionDown(item.question_id)} />
                                                    <FontAwesomeIcon icon={faEllipsisV} style={{ color: "#4da3ff", cursor: "pointer" }} onClick={() => this.handleOpenQuestion(item.question_id, false)} />
                                                </div>
                                            </div>
                                            <div style={{ marginLeft: 50 + "px" }}>
                                                {
                                                    item.questions !== undefined ?
                                                        item.questions.sort((a, b) => a.position - b.position).map(subItem => {
                                                            const totalSubQuestions = item.questions.length

                                                            return (
                                                                <div key={subItem.question_id} className="row-question">
                                                                    <div className="row-flex">
                                                                        <div className="div-numering">
                                                                            {subItem.numering_type === 2 ? subItem.numering + "." : <ul style={{ marginBottom: 0 }}><li></li></ul>}
                                                                        </div>
                                                                        <div style={{ marginRight: 5 + "px" }}>
                                                                            {subItem.grade !== "" ? "(" + subItem.grade.toString().replace(".", ",") + "%)" : null}
                                                                        </div>
                                                                        <div contentEditable="true" className="form-control-plaintext text-justify form-control" spellCheck="false"
                                                                            onMouseUp={(e) => this.handleMouseUp(e, subItem.question_id, "sub", item.question_id)} id={`divQuestion${subItem.question_id}`}
                                                                            onBlur={(e) => this.handleChangeTextQuestion(e, subItem.question_id, item.question_id)} style={{ height: "inherit" }}
                                                                            dangerouslySetInnerHTML={this.createMarkup(subItem.text)}></div>
                                                                        <div className="question-options" style={{ display: "inherit" }}>
                                                                            <FontAwesomeIcon icon={faCaretUp} style={{ color: subItem.position !== 1 ? "#4da3ff" : null, cursor: "pointer" }}
                                                                                onClick={() => this.handleMoveSubQuestionUp(item.question_id, subItem.question_id)} />
                                                                            <FontAwesomeIcon icon={faCaretDown} style={{ color: subItem.position !== totalSubQuestions ? "#4da3ff" : null, cursor: "pointer" }}
                                                                                onClick={() => this.handleMoveSubQuestionDown(item.question_id, subItem.question_id)} />
                                                                            <FontAwesomeIcon icon={faEllipsisV} style={{ color: "#4da3ff", cursor: "pointer" }}
                                                                                onClick={() => this.handleOpenQuestion(subItem.question_id, true, item.question_id)} />
                                                                        </div>
                                                                    </div>
                                                                </div>)
                                                        })
                                                        :
                                                        null
                                                }
                                                <InputGroup style={{ marginTop: 5 + "px" }}>
                                                    <Input id={`txtSubNewQuestion${item.question_id}`} autoComplete="off" bsSize="sm" />
                                                    <InputGroupAddon addonType="append" onClick={() => this.handleNewQuestion(item.question_id)} style={{ cursor: "pointer" }}>
                                                        <InputGroupText><FontAwesomeIcon icon={faPlus} /></InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>

                                                {
                                                    item.footer_note !== undefined && item.footer_note !== "" ?
                                                        <div style={{ marginTop: 5 + "px" }}>
                                                            <div contentEditable="true" className="form-control-plaintext text-justify" spellCheck="false"
                                                                onMouseUp={(e) => this.handleMouseUp(e, item.question_id, "footer")} id={`divQuestion${item.question_id}_footer`}
                                                                dangerouslySetInnerHTML={this.createMarkup(item.footer_note)}></div>
                                                        </div>
                                                        : null
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <InputGroup style={{ marginTop: 5 + "px" }}>
                                <Input id="txtNewQuestion" autoComplete="off" />
                                <InputGroupAddon addonType="append" onClick={() => this.handleNewQuestion()} style={{ cursor: "pointer" }}>
                                    <InputGroupText><FontAwesomeIcon icon={faPlus} /></InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 10 + "px", marginBottom: 5 + "px", borderTop: "1px solid lightgray" }}>
                        <Col>
                            Ficheiros anexos
                        </Col>
                    </Row>
                    <Row className="attach">
                        <Col>
                            <CardDeck>
                                {this.state.attachments.filter(item => !item.delete).map((item, index) =>
                                    <Card key={index} className="text-center">
                                        <CardBody onClick={() => window.open(item.url)}>
                                            <FontAwesomeIcon icon={faFile} />
                                            <CardTitle title={item.filename}>{item.filename}</CardTitle>
                                            <FontAwesomeIcon icon={faTimesCircle} className="delete-file" onClick={(e) => this.handleDeleteAttach(index, e)} />
                                        </CardBody>
                                    </Card>
                                )}
                                <Card className="text-center">
                                    <CardBody className="align-middle">
                                        <FontAwesomeIcon icon={faPlus} style={{ fontSize: 1.5 + "rem", marginTop: 1.2 + "rem", cursor: "pointer" }} />
                                        <input type="file" id="addAttach" title="" onChange={this.handleAddAttach}
                                            style={{ position: "relative", top: -42 + "px", left: 0 + "px", width: 88 + "px", height: 62 + "px", opacity: 0, cursor: "pointer" }} />
                                    </CardBody>
                                </Card>
                            </CardDeck>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 + "px" }}>
                        <Col className="text-right">
                            <Button color="primary" onClick={this.handleSaveDocument}>Gravar</Button>
                        </Col>
                    </Row>
                </Container>

                <UncontrolledPopover placement="bottom" target={this.state.popover.control} isOpen={this.state.popover.isOpen}>
                    <PopoverBody>
                        <Container>
                            <Row>
                                <Col>
                                    <FontAwesomeIcon icon={faBold} className="format-options" onClick={() => this.handleFormat("b")} />
                                    <FontAwesomeIcon icon={faItalic} className="format-options" onClick={() => this.handleFormat("i")} />
                                    <FontAwesomeIcon icon={faUnderline} className="format-options" onClick={() => this.handleFormat("u")} />
                                    <FontAwesomeIcon icon={faSuperscript} className="format-options" onClick={() => this.handleFormat("sup")} />
                                    <FontAwesomeIcon icon={faSubscript} className="format-options" onClick={() => this.handleFormat("sub")} />
                                </Col>
                            </Row>
                        </Container>
                    </PopoverBody>
                </UncontrolledPopover>

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
                                        {this.state.conf.curricularYears.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                                <Label for="lstSemester" sm={2}>Semestre</Label>
                                <Col sm={4}>
                                    <Input type="select" id="lstSemester" value={this.state.doc.semester} onChange={(e) => this.setState({ doc: { ...this.state.doc, semester: e.target.value } })}>
                                        {this.state.conf.semesters.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lstUnit" sm={2}>Disciplina</Label>
                                <Col sm={4}>
                                    <Input type="select" id="lstUnit" value={this.state.doc.curricular_unit} onChange={(e) => this.setState({ doc: { ...this.state.doc, curricular_unit: e.target.value } })}>
                                        {this.state.conf.curricularUnits.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                                <Label for="lstSeason" sm={2}>Época</Label>
                                <Col sm={4}>
                                    <Input type="select" id="lstSeason" value={this.state.doc.season} onChange={(e) => this.setState({ doc: { ...this.state.doc, season: e.target.value } })}>
                                        {this.state.conf.seasons.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
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
                                        {this.state.conf.instructionTypes.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                                <Label for="txtGrade" sm={2}>Cotação</Label>
                                <Col sm={4}>
                                    <Input type="number" id="txtGrade" value={this.state.doc.grade} min="0" max="20" step="0.5"
                                        onChange={(e) => this.setState({ doc: { ...this.state.doc, grade: e.target.value } })} />
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.modalQuestion.isOpen} toggle={this.toggleQuestion} backdrop="static" keyboard={false} size="lg">
                    <ModalHeader toggle={this.toggleQuestion}>Detalhe da pergunta</ModalHeader>
                    <ModalBody>
                        <Form autoComplete="off">
                            <FormGroup row>
                                <Label for="lstNumeringType" sm={2}>Tipo</Label>
                                <Col sm={4}>
                                    <Input type="select" id="lstNumeringType" defaultValue={this.state.modalQuestion.fields.numeringType}
                                        onChange={(e) => this.setState({ modalQuestion: { ...this.state.modalQuestion, fields: { ...this.state.modalQuestion.fields, numeringType: e.target.value * 1 } } })}>
                                        {this.state.conf.numeringTypes.map(item => { return (<option key={item.id} value={item.id}>{item.value}</option>) })}
                                    </Input>
                                </Col>
                                <Label for="txtNumering" sm={2}>Numeração</Label>
                                <Col sm={4}>
                                    <Input type="number" id="txtNumering" defaultValue={this.state.modalQuestion.fields.numering} min="0" max="50" step=".01"
                                        disabled={this.state.modalQuestion.fields.numeringType === 1 ? true : false}
                                        onChange={(e) => this.setState({ modalQuestion: { ...this.state.modalQuestion, fields: { ...this.state.modalQuestion.fields, numering: e.target.value } } })} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="txtGrade" sm={2}>Cotação</Label>
                                <Col sm={4}>
                                    <Input type="number" id="txtGrade" defaultValue={this.state.modalQuestion.fields.grade} min="0" max="100" step="1"
                                        onChange={(e) => this.setState({ modalQuestion: { ...this.state.modalQuestion, fields: { ...this.state.modalQuestion.fields, grade: e.target.value } } })} />
                                </Col>
                            </FormGroup>
                            {
                                !this.state.modalQuestion.subQuestion ?
                                    <FormGroup row>
                                        <Label for="txtFooteNote" sm={2}>Texto de rodapé</Label>
                                        <Col sm={10}>
                                            <Input type="textarea" id="txtFooteNote" defaultValue={this.state.modalQuestion.fields.footerNote}
                                                onChange={(e) => this.setState({ modalQuestion: { ...this.state.modalQuestion, fields: { ...this.state.modalQuestion.fields, footerNote: e.target.value } } })} />
                                        </Col>
                                    </FormGroup>
                                    : null
                            }
                        </Form>
                    </ModalBody>
                    <ModalFooter style={{ justifyContent: "space-between" }}>
                        <Button color="danger" onClick={this.handleDeleteQuestion}><FontAwesomeIcon icon={faTrash} style={{ marginRight: 10 + "px" }} />Eliminar</Button>
                        <Button color="primary" onClick={this.handleChangeQuestion}><FontAwesomeIcon icon={faCheck} style={{ marginRight: 10 + "px" }} />Alterar</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalVersions.isOpen} toggle={this.toggleVersions} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.toggleVersions}>Versões do enunciado (últimas 10)</ModalHeader>
                    <ModalBody>
                        <Container>
                            <Row>
                                <Col xs="9"><b>Versão</b></Col>
                                <Col xs="3"></Col>
                            </Row>
                            {
                                this.state.modalVersions.revisions.map((item, index) =>
                                    <Row key={item} style={{ paddingTop: 5 + "px", paddingBottom: 5 + "px" }}>
                                        <Col xs="9">{item}</Col>
                                        <Col xs="3" className="text-right">
                                            <Link to="#" onClick={(e) => this.handleViewRevision(e, item)} style={{ padding: 5 + "px" }} title="Visualizar"><FontAwesomeIcon icon={faEye} /></Link>
                                            <Link to="#" onClick={(e) => this.handleChangeRevision(e, item)} style={{ padding: 5 + "px" }} title="Escolher"><FontAwesomeIcon icon={faCheck} /></Link>
                                        </Col>
                                    </Row>
                                )
                            }
                        </Container>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

export default connect()(Document)