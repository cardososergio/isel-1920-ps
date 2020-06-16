import React from "react"
import { connect } from "react-redux"
import { Container, Row, Col, Input } from "reactstrap"
import PouchDB from 'pouchdb'
import { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import pt from 'date-fns/locale/pt'
import "./Document.css"
import * as Constants from "../../Constants"

registerLocale('pt', pt)

const conf = JSON.parse(localStorage.getItem("configuration"))

class Preview extends React.Component {
    constructor(props) {
        super(props)

        const params = new URLSearchParams(document.location.search);

        this.state = {
            loading: true,
            id: params.get("id"),
            revision_id: params.get("revision"),
            doc: undefined,
            default: {
                numeringType: 2
            }
        }
    }

    createMarkup(text) {
        return { __html: text };
    }


    componentDidMount() {
        const db = new PouchDB(Constants.URL_COUCHDB)

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
                        <Col>{this.state.doc.name}</Col>
                    </Row>
                    <Row className="text-center font">
                        <Col xs={{ size: 6, offset: 3 }} style={{ fontWeight: "bold" }}>
                            {this.state.doc.header.school_name}
                        </Col>
                        <Col xs={{ size: 6, offset: 3 }}>
                            {this.state.doc.header.courses.map((item, index) => <div key={index}>{item}</div>)}
                        </Col>
                        <Col xs={{ size: 6, offset: 3 }} style={{ fontWeight: "bold" }}>{conf.curricularUnits.find(item => item.id === this.state.doc.curricular_unit).value}</Col>
                        <Col xs={{ size: 6, offset: 3 }}>
                            <Input type="text" defaultValue={this.state.doc.header.description} className="text-center" placeholder="descritivo do enunciado" autoComplete="off" />
                        </Col>
                        <Col xs={{ size: 6, offset: 3 }} style={{ marginTop: 5 + "px" }}>
                            <Input type="text" defaultValue={this.state.doc.header.delivery_note} className="text-center" placeholder="duração do teste/exame/trabalho" autoComplete="off" />
                        </Col>
                    </Row>
                    <Row className="font row-margin">
                        <Col>
                            {
                                this.state.doc.questions.sort((a, b) => a.position - b.position).map(item =>
                                    <div key={item.question_id} className="row-question">
                                        <div className="row-flex">
                                            <div className="div-numering">
                                                {item.numering_type === 2 ? item.numering + "." : <ul style={{ marginBottom: 0 }}><li></li></ul>}
                                            </div>
                                            <div style={{ marginRight: 5 + "px" }}>
                                                {item.grade !== "" ? "(" + item.grade.toString().replace(".", ",") + "%)" : null}
                                            </div>
                                            <div contentEditable="true" className="form-control-plaintext text-justify" spellCheck="false"
                                                id={`divQuestion${item.question_id}`} dangerouslySetInnerHTML={this.createMarkup(item.text)}></div>
                                        </div>
                                        <div style={{ marginLeft: 50 + "px" }}>
                                            {
                                                item.questions !== undefined ?
                                                    item.questions.sort((a, b) => a.position - b.position).map(subItem =>
                                                        <div key={subItem.question_id} className="row-question">
                                                            <div className="row-flex">
                                                                <div className="div-numering">
                                                                    {subItem.numering_type === 2 ? subItem.numering + "." : <ul style={{ marginBottom: 0 }}><li></li></ul>}
                                                                </div>
                                                                <div style={{ marginRight: 5 + "px" }}>
                                                                    {subItem.grade !== "" ? "(" + subItem.grade.toString().replace(".", ",") + "%)" : null}
                                                                </div>
                                                                <div contentEditable="true" className="form-control-plaintext text-justify" spellCheck="false"
                                                                    id={`divQuestion${subItem.question_id}`} dangerouslySetInnerHTML={this.createMarkup(subItem.text)}></div>
                                                            </div>
                                                        </div>
                                                    )
                                                    :
                                                    null
                                            }
                                            {
                                                item.footer_note !== undefined && item.footer_note !== "" ?
                                                    <div style={{ marginTop: 5 + "px" }}>
                                                        <div contentEditable="true" className="form-control-plaintext text-justify" spellCheck="false"
                                                            id={`divQuestion${item.question_id}_footer`} dangerouslySetInnerHTML={this.createMarkup(item.footer_note)}></div>
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col>References</Col>
                    </Row>
                </Container>
            </>
        )
    }
}
export default connect()(Preview)