import React from 'react';
import { Route, Switch } from 'react-router';
import { Redirect } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Management } from './components/management/Management'
import Login from './components/Login';
import { PageNotFound } from "./components/PageNotFound"

import './custom.css'

export default class App extends React.Component {
    static displayName = App.name;

    constructor(props) {
        super(props)

        this.state = {
            validAccessToken: true
        }
    }

    componentDidMount() {
        
        if (localStorage.getItem("isOffline") === null || localStorage.getItem("isOffline") === "false") {
            // Check if AccessToken exist and is valid
            fetch("/api/users/check").then(response => { if (response.status === 200) return response.json(); return Promise.reject(response.statusText) })
                .then(json => {
                    if (json !== this.state.validAccessToken)
                        this.setState({ validAccessToken: json })

                    if (json) {
                        fetch('/api/users/configuration')
                            .then(response => { if (response.status === 200) return response.json(); return Promise.reject(response.statusText) })
                            .then(data => {

                                if (localStorage.getItem("configuration") === null)
                                    localStorage.setItem("configuration", JSON.stringify(data))
                                else {
                                    // compare
                                    const local = JSON.parse(localStorage.getItem("configuration"))
                                    const server = data

                                    let gotChanges = false
                                    gotChanges = !local.curricularYears.every(l => {
                                        return !(server.curricularYears.find(s => l.id === s.id) === undefined || server.curricularYears.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
                                    })

                                    if (!gotChanges)
                                        gotChanges = !local.semesters.every(l => {
                                            return !(server.semesters.find(s => l.id === s.id) === undefined || server.semesters.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
                                        })

                                    if (!gotChanges)
                                        gotChanges = !local.seasons.every(l => {
                                            return !(server.seasons.find(s => l.id === s.id) === undefined || server.seasons.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
                                        })

                                    if (!gotChanges)
                                        gotChanges = !local.instructionTypes.every(l => {
                                            return !(server.instructionTypes.find(s => l.id === s.id) === undefined || server.instructionTypes.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
                                        })

                                    if (!gotChanges)
                                        gotChanges = !local.curricularUnits.every(l => {
                                            return !(server.curricularUnits.find(s => l.id === s.id) === undefined || server.curricularUnits.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
                                        })

                                    if (gotChanges) {
                                        console.log("conf !=")
                                        const x = window.confirm("Os registos locais estão diferentes dos do servidor. Deseja atualiza-los?")
                                    }
                                    else {
                                        console.log("conf ==")
                                    }
                                }
                            })
                            .catch(error => {
                                console.error(error)
                                alert('Não foi possível ligar à base de dados!')
                            })
                    }
                })
                .catch(error => {
                    console.error(error)
                    alert("Erro fatal!")
                })
        } else {
            console.log("offline")
        }
    }

    render() {
        return (
            <Layout>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/management' component={Management} />
                    <Route component={PageNotFound} />
                </Switch>
                {!this.state.validAccessToken ? <Redirect to="/login" /> : null}
            </Layout>
        );
    }
}
