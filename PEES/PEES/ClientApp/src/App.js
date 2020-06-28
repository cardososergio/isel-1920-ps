import React from 'react'
import { connect } from "react-redux"
import { Route, Switch } from 'react-router'
import Layout from './components/Layout'
import Home from './components/Home'
import Unit from './components/search/Unit'
import Login from './components/auth/Login'
import ViewOnly from './components/viewonly/ViewOnly'
import { Management } from './components/management/Management'
import { PageNotFound } from "./components/PageNotFound"
import Document from './components/document/Document'
import NewUser from './components/auth/NewUser'
import Backoffice from './components/versioning/Backoffice'
import * as Constants from "./components/global/Constants"
import Preview from './components/document/Preview'
import PDF from './components/document/PDF'
import './custom.css'
import DocumentViewOnly from './components/viewonly/DocumentViewOnly'

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
        if (document.location.pathname.toLowerCase() === "/view") {
            this.setState({ noGo: false })
            return
        }

        const _this = this;

        (async function () {
            const status = await checkNetwork()
            localStorage.setItem("isOffline", !status)

            if (localStorage.getItem("isOffline") === null || localStorage.getItem("isOffline") === "false") {

                (async function () {
                    // Check if AccessToken exists and is valid
                    const response = await fetch("/api/users/check")
                    const json = await response.json()
                    if (json !== _this.state.validAccessToken)
                        _this.setState({ validAccessToken: json })

                    _this.setState({ noGo: false })
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

        if (this.state.noGo) return (<></>)

        return (
            <Layout>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path="/newuser" component={NewUser} />
                    <Route exact path='/unit' component={Unit} />
                    <Route exact path='/document' component={Document} />
                    <Route exact path='/management' component={Management} />
                    <Route exact path="/versioncontrol" component={Backoffice} />
                    <Route exact path="/preview" component={Preview} />
                    <Route exact path="/pdf" component={PDF} />
                    <Route exact path="/view" component={ViewOnly} />
                    <Route exact path="/view/document" component={DocumentViewOnly} />
                    <Route component={PageNotFound} />
                </Switch>
            </Layout>
        );
    }
}

export default connect()(App)