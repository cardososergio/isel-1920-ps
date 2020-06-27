import React from "react"
import { connect } from "react-redux"
import { Container, Row, Col, CardDeck, Card, CardBody, CardTitle } from "reactstrap"
import PouchDB from 'pouchdb'
import * as Constants from "../../Constants"
import "./Document.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFile } from "@fortawesome/free-solid-svg-icons"

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
            attachments: []
        }
    }

    createMarkup(text) {
        return { __html: text }
    }

    componentDidMount() {
        const db = new PouchDB(Constants.URL_COUCHDB)

        db.get(this.state.id, { rev: this.state.revision_id, attachments: true })
            .then(doc => {
                // change curricular unit id for name
                doc.header.curricular_unit = conf.curricularUnits.find(item => item.id === doc.curricular_unit).value

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
                            <div className="text-center">{this.state.doc.header.description}</div>
                        </Col>
                        <Col xs={{ size: 6, offset: 3 }} style={{ marginTop: 5 + "px" }}>
                            <div className="text-center">{this.state.doc.header.delivery_note}</div>
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
                                            <div className="form-control-plaintext text-justify" dangerouslySetInnerHTML={this.createMarkup(item.text)}></div>
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
                                                                <div className="form-control-plaintext text-justify" dangerouslySetInnerHTML={this.createMarkup(subItem.text)}></div>
                                                            </div>
                                                        </div>
                                                    )
                                                    :
                                                    null
                                            }
                                            {
                                                item.footer_note !== undefined && item.footer_note !== "" ?
                                                    <div style={{ marginTop: 5 + "px" }}>
                                                        <div className="form-control-plaintext text-justify" dangerouslySetInnerHTML={this.createMarkup(item.footer_note)}></div>
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                )
                            }
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
                                        </CardBody>
                                    </Card>
                                )}
                            </CardDeck>
                        </Col>
                    </Row>
                </Container>
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

export default connect()(Preview)