import React from 'react'
import { Route, Switch } from 'react-router'
import { Layout } from './components/Layout'
import Home from './components/Home'
import { Management } from './components/management/Management'
import Login from './components/auth/Login'
import { PageNotFound } from "./components/PageNotFound"
import Document from './components/document/Document'
import './custom.css'
import NewUser from './components/auth/NewUser'
import { connect } from "react-redux"
import Backoffice from './components/versioning/Backoffice'

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

        if (localStorage.getItem("isOffline") === null || localStorage.getItem("isOffline") === "false") {

            const request = async () => {
                // Check if AccessToken exist and is valid
                const response = await fetch("/api/users/check")
                const json = await response.json()
                if (json !== this.state.validAccessToken)
                    this.setState({ validAccessToken: json })

                //var localDB = new PouchDB('pees')
                //var remoteDB = new PouchDB('http://127.0.0.1:5984/pees')
                //localDB.sync(remoteDB)

                if (json) {
                    const request2 = async () => {
                        const response2 = await fetch('/api/users/configuration')
                        const data = await response2.json()

                        // compare Curricular units
                        const localConfig = JSON.parse(localStorage.getItem("configuration"))
                        const serverConfig = data

                        let gotChanges = !localConfig.curricularUnits.every(l => {
                            return !(serverConfig.curricularUnits.find(s => l.id === s.id) === undefined || serverConfig.curricularUnits.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
                        })

                        if (!gotChanges) {
                            localStorage.setItem("configuration", JSON.stringify(serverConfig))
                        }
                        else {
                            this.props.dispatch({ type: "BACKOFFICE_DATA", payload: serverConfig })
                            this.props.dispatch({ type: "BACKOFFICE_VERSION_CONTROL", payload: gotChanges })
                        }

                        this.setState({ noGo: false })
                    }

                    request2()
                }
                else {
                    this.setState({ noGo: false })
                }
            }

            request()
        } else {
            console.log("offline")
            this.setState({ noGo: false })
        }
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
                    <Route component={PageNotFound} />
                </Switch>
            </Layout>
        );
    }
}

export default connect()(App)