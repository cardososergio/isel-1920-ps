import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { connect } from "react-redux"
import Filter from './search/Filter'
import UnitsCard from "./search/UnitsCard"
import "./Home.css"
import PouchDB from 'pouchdb'
import { Redirect } from 'react-router-dom'
import * as Constants from "./global/Constants"
import Cookies from 'js-cookie'
import NewDocument from './document/NewDocument'

class Home extends React.Component {
    static displayName = Home.name;

    constructor(props) {
        super(props)

        this.state = {
            docId: "",
            gotBackofficeChanges: false,
            noGo: true,
            conf: JSON.parse(localStorage.getItem("configuration")),
            haveAccessCookie: true
        }

        this.handleCreateDocument = this.handleCreateDocument.bind(this)
    }

    componentDidMount() {

        if (Cookies.get('AccessToken') === undefined) {
            this.setState({ haveAccessCookie: false })
            return
        }

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

            // first time
            if (localConfig === null) {
                localStorage.setItem("configuration", JSON.stringify(serverConfig))
                this.setState({ conf: JSON.parse(localStorage.getItem("configuration")) })
            }
            else {
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
            }

            PouchDB.replicate(Constants.URL_COUCHDB_OFFLINE, Constants.URL_COUCHDB);
            PouchDB.replicate(Constants.URL_COUCHDB, Constants.URL_COUCHDB_OFFLINE);

            _this.setState({ noGo: false })
        })()
    }

    handleCreateDocument(id) {
        this.setState({ docId: id })
    }

    render() {
        if (this.state.gotBackofficeChanges)
            return (<Redirect to="/versioncontrol" />)

        if (!this.state.haveAccessCookie)
            return (<Redirect to="/login" />)

        if (this.state.noGo)
            return (<></>)

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
                            <UnitsCard />
                        </Col>
                    </Row>
                </Container>
                <NewDocument handleCreateDocument={this.handleCreateDocument} />
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

export default connect(mapStateToProps)(Home)