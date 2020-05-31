import React from "react"
import { Container, Row, Col } from "reactstrap"
import PouchDB from 'pouchdb'
import PouchdbFind from 'pouchdb-find'
import { connect } from 'react-redux'
import { LocalVersion } from "./LocalVersion"

class BackOffice extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            difCurricularUnits: [],
            difCurricularYears: [],
            difSemesters: [],
            difSeasons: [],
            difInstructionTypes: []
        }

        this.handleOnUpdate = this.handleOnUpdate.bind(this)
    }

    componentDidMount() {
        const localConfig = JSON.parse(localStorage.getItem("configuration"))
        const serverConfig = this.props.backofficeData

        // compare
        const difCurricularUnits = localConfig.curricularUnits.filter(l => {
            return (serverConfig.curricularUnits.find(s => l.id === s.id) === undefined || serverConfig.curricularUnits.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
        })
        // compare
        const difCurricularYears = localConfig.curricularYears.filter(l => {
            return (serverConfig.curricularYears.find(s => l.id === s.id) === undefined || serverConfig.curricularYears.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
        })
        // compare
        const difSemesters = localConfig.semesters.filter(l => {
            return (serverConfig.semesters.find(s => l.id === s.id) === undefined || serverConfig.semesters.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
        })
        // compare
        const difSeasons = localConfig.seasons.filter(l => {
            return (serverConfig.seasons.find(s => l.id === s.id) === undefined || serverConfig.seasons.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
        })
        // compare
        const difInstructionTypes = localConfig.instructionTypes.filter(l => {
            return (serverConfig.instructionTypes.find(s => l.id === s.id) === undefined || serverConfig.instructionTypes.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
        })

        // check if the change is in use by pouchDB
        PouchDB.plugin(PouchdbFind)
        const db = new PouchDB("pees")

        const find = { user_id: JSON.parse(localStorage.getItem("user")).userId }

        db.find({ selector: find })
            .then((result) => {

                let updateCurricularUnits = []
                let updateCurricularYears = []
                let updateSemesters = []
                let updateSeasons = []
                let updateInstructionTypes = []

                result.docs.forEach(doc => {

                    let r = difCurricularUnits.find(item => item.id === doc.curricular_unit)
                    if (r !== undefined && updateCurricularUnits.find(e => e.id === r.id) === undefined)
                        updateCurricularUnits.push(r)

                    r = difCurricularYears.find(item => item.id === doc.curricular_year)
                    if (r !== undefined && updateCurricularYears.find(e => e.id === r.id) === undefined)
                        updateCurricularYears.push(r)

                    r = difSemesters.find(item => item.id === doc.semester)
                    if (r !== undefined && updateSemesters.find(e => e.id === r.id) === undefined)
                        updateSemesters.push(r)

                    r = difSeasons.find(item => item.id === doc.season)
                    if (r !== undefined && updateSeasons.find(e => e.id === r.id) === undefined)
                        updateSeasons.push(r)

                    r = difInstructionTypes.find(item => item.id === doc.instruction_type)
                    if (r !== undefined && updateInstructionTypes.find(e => e.id === r.id) === undefined)
                        updateInstructionTypes.push(r)
                })

                this.setState({ difCurricularUnits: updateCurricularUnits, difCurricularYears: updateCurricularYears, difSemesters: updateSemesters, difSeasons: updateSeasons, difInstructionTypes: updateInstructionTypes })
            })
            .catch(function (err) {
                console.eror(err)
            })
    }

    handleOnUpdate(type) {

        fetch('/api/users/configuration').then(response => response.json())
            .then(data => {
                const localConfig = JSON.parse(localStorage.getItem("configuration"))
                const serverConfig = data

                let auxType, auxDocType, auxStateType
                switch (type) {
                    case "curricularunit":
                        auxType = "curricularUnits"
                        auxDocType = "curricular_unit"
                        auxStateType = "difCurricularUnits"
                        break
                    case "curricularyear":
                        auxType = "curricularYears"
                        auxDocType = "curricular_year"
                        auxStateType = "difCurricularYears"
                        break
                    case "semester":
                        auxType = "semesters"
                        auxDocType = "semester"
                        auxStateType = "difSemesters"
                        break
                    case "season":
                        auxType = "seasons"
                        auxDocType = "season"
                        auxStateType = "difSeasons"
                        break
                    case "instructiontype":
                        auxType = "instructionTypes"
                        auxDocType = "instruction_type"
                        auxStateType = "difInstructionTypes"
                        break
                    default:
                }

                // compare
                const dif = localConfig[auxType].filter(l => {
                    return (serverConfig[auxType].find(s => l.id === s.id) === undefined || serverConfig[auxType].find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
                })

                // check if the change is in use by pouchDB
                PouchDB.plugin(PouchdbFind)
                const db = new PouchDB("pees")

                const find = { user_id: JSON.parse(localStorage.getItem("user")).userId }

                db.find({ selector: find })
                    .then((result) => {

                        let update = []

                        result.docs.forEach(doc => {

                            let r = dif.find(item => item.id === doc[auxDocType])
                            if (r !== undefined && update.find(e => e.id === r.id) === undefined)
                                update.push(r)
                        })
                        
                        this.setState({ [auxStateType]: update })
                    })
                    .catch(function (err) {
                        console.eror(err)
                    })
            })
    }

    render() {

        return (
            <Container>
                <Row>
                    <Col className="text-center" style={{ marginBottom: 20 + "px" }}>
                        Existem registos que estão diferentes dos que estão no servidor
                </Col>
                </Row>
                <LocalVersion data={this.state.difCurricularUnits} title="Disciplinas" type="curricularunit" onUpdate={() => this.handleOnUpdate("curricularunit")} />
                <LocalVersion data={this.state.difCurricularYears} title="Anos letivos" type="curricularyear" onUpdate={() => this.handleOnUpdate("curricularyear")} />
                <LocalVersion data={this.state.difSemesters} title="Semetres" type="semester" onUpdate={() => this.handleOnUpdate("semester")} />
                <LocalVersion data={this.state.difSeasons} title="Épocas" type="season" onUpdate={() => this.handleOnUpdate("season")} />
                <LocalVersion data={this.state.difInstructionTypes} title="Tipos de enunciado" type="instructiontype" onUpdate={() => this.handleOnUpdate("instructiontype")} />
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