import React from 'react'
import { connect } from "react-redux"
import { Route, Switch } from 'react-router'
import Layout from './components/Layout'
import Home from './components/Home'
import Login from './components/auth/Login'
import { Management } from './components/management/Management'
import { PageNotFound } from "./components/PageNotFound"
import Document from './components/document/Document'
import NewUser from './components/auth/NewUser'
import Backoffice from './components/versioning/Backoffice'
import * as Constants from "./Constants"
import Preview from './components/document/Preview'
import PouchDB from 'pouchdb'
import './custom.css'

async function checkNetwork() {
    try {
        await (await fetch(Constants.URL_COUCHDB_NOAUTH)).json();
        return true;
    } catch (e) { return false }
}

class App extends React.Component {
    static displayName = App.name;

    constructor(props) {
        super(props)

        this.state = {
            validAccessToken: false,
            noGo: true
        }

        this.handleAccessToken = this.handleAccessToken.bind(this)
    }

    componentDidMount() {
        const _this = this;

        (async function () {
            const status = await checkNetwork()
            localStorage.setItem("isOffline", !status)

            if (localStorage.getItem("isOffline") === null || localStorage.getItem("isOffline") === "false") {

                (async function () {
                    // Check if AccessToken exist and is valid
                    const response = await fetch("/api/users/check")
                    const json = await response.json()
                    if (json !== _this.state.validAccessToken)
                        _this.setState({ validAccessToken: json })

                    /*if (json) {
                        (async function () {
                            const response2 = await fetch('/api/users/configuration')
                            const data = await response2.json()

                            // compare
                            const localConfig = JSON.parse(localStorage.getItem("configuration"))
                            const serverConfig = data

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

                            if (!gotChanges) {
                                localStorage.setItem("configuration", JSON.stringify(serverConfig))
                            }
                            else {
                                _this.props.dispatch({ type: "BACKOFFICE_DATA", payload: serverConfig })
                                _this.props.dispatch({ type: "BACKOFFICE_VERSION_CONTROL", payload: gotChanges })
                            }

                            

                            _this.setState({ noGo: false })
                        })()
                    }
                    else {
                        _this.setState({ noGo: false })
                    }*/
                })()
            } else {
                const user = localStorage.getItem("user")
                _this.setState({ noGo: (user === null), validAccessToken: (user !== null) })
            }
        })()
    }

    handleAccessToken() {
        this.setState({ validAccessToken: true })
    }

    render() {

        if (document.location.pathname.toLowerCase() === "/newuser")
            return (
                <Layout>
                    <NewUser />
                </Layout>
            )

        if (this.state.noGo) return (<></>)

        if (!this.state.validAccessToken)
            return (
                <Layout>
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/newuser" component={NewUser} />
                        <Route exact path="/versioncontrol" component={Backoffice} />
                        <Route exact path='/document' component={Document} />
                        <Route exact path="/preview" component={Preview} />
                    </Switch>
                </Layout>
            )

        return (
            <Layout>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/document' component={Document} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/management' component={Management} />
                    <Route exact path="/newuser" component={NewUser} />
                    <Route exact path="/versioncontrol" component={Backoffice} />
                    <Route exact path="/preview" component={Preview} />
                    <Route component={PageNotFound} />
                </Switch>
            </Layout>
        );
    }
}

export default connect()(App)