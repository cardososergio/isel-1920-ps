import React from "react"
import { Container, Row, Col } from "reactstrap"
import PouchDB from 'pouchdb'
import PouchdbFind from 'pouchdb-find'
import { connect } from 'react-redux'

class BackOffice extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            difCurricularUnits: [],
            serverCurricularUnits: []
        }
    }

    componentDidMount() {
        const localConfig = JSON.parse(localStorage.getItem("configuration"))
        const serverConfig = this.props.backofficeData

        // compare Curricular units        
        const dif = localConfig.curricularUnits.filter(l => {
            return (serverConfig.curricularUnits.find(s => l.id === s.id) === undefined || serverConfig.curricularUnits.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
        })

        if (dif.length !== 0) {
            // check if the change is in use by pouchDB
            PouchDB.plugin(PouchdbFind)
            const db = new PouchDB("pees")

            const find = { user_id: JSON.parse(localStorage.getItem("user")).userId }

            db.find({ selector: find })
                .then((result) => {

                    let update = []

                    result.docs.forEach(doc => {
                        const r = dif.find(item => item.id === doc.curricular_unit)

                        if (r !== undefined) {
                            if (update.find(e => e.id === r.id) === undefined)
                                update.push(r)
                        }
                    })

                    let serverUpdate = []

                    dif.forEach(item => {
                        const request = async () => {
                            const response = await fetch('/api/versioncontrol/' + item.id)
                            const data = await response.json()

                            if (data.length !== 0)
                                data.map(x => serverUpdate.push(x))

                            this.setState({ serverCurricularUnits: serverUpdate, difCurricularUnits: update })
                        }

                        request()
                    })
                })
                .catch(function (err) {
                    console.log(err)
                })
        }
    }

    render() {
        console.log(this.state.serverCurricularUnits)
        return (
            <Container>
                <Row>
                    <Col className="text-center" style={{ marginBottom: 20 + "px" }}>
                        Existem registos que estão diferentes dos que estão no servidor
                </Col>
                </Row>
                <Row>
                    <Col style={{ borderBottom: "1px solid lightgray" }}>
                        <b>Disciplinas</b>
                    </Col>
                </Row>
                <Row>
                    <Col>local</Col>
                    <Col>servidor</Col>
                </Row>
                {
                    this.state.difCurricularUnits.map(item => {
                        return (
                            <Row key={item.id}>
                                <Col>{item.value}</Col>
                                <Col>
                                    <Container style={{ marginTop: 0 }}>
                                        {
                                            this.state.serverCurricularUnits.map((s, index) => {
                                                return (
                                                    <Row key={index}>
                                                        <Col>{s.value}</Col>
                                                        <Col xs="1">{s.revision}</Col>
                                                        <Col>{s.revisionDate}</Col>
                                                        <Col xs="1">{s.isDeleted ? 1 : 0}</Col>
                                                    </Row>
                                                )
                                            })
                                        }
                                    </Container>
                                </Col>
                            </Row>
                        )
                    })
                }
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        backofficeData: state.backofficeData,
    }
}
export default connect(mapStateToProps)(BackOffice)