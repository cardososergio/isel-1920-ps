import React from 'react';
import { Route, Switch } from 'react-router';
import { Layout } from './components/Layout';
import Home from './components/Home';
import { Management } from './components/management/Management'
import Login from './components/auth/Login';
import { PageNotFound } from "./components/PageNotFound"
import Document from './components/document/Document';
import './custom.css'
import NewUser from './components/auth/NewUser';

export default class App extends React.Component {
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

            // Check if AccessToken exist and is valid
            fetch("/api/users/check").then(response => { if (response.status === 200) return response.json(); return Promise.reject(response.statusText) })
                .then(json => {
                    if (json !== this.state.validAccessToken)
                        this.setState({ validAccessToken: json })

                    if (json) {
                        fetch('/api/users/configuration')
                            .then(response => { if (response.status === 200) return response.json(); return Promise.reject(response.statusText) })
                            .then(data => {
                                localStorage.setItem("configuration", JSON.stringify(data))
                            })
                            .catch(error => {
                                console.error(error)
                                alert('Não foi possível ligar à base de dados!')
                            })
                    }

                    this.setState({ noGo: false })
                })
                .catch(error => {
                    console.error(error)
                    alert("Erro fatal!")
                })
        } else {
            console.log("offline")
            this.setState({ noGo: false })
        }
    }

    handleAccessToken() {
        this.setState({ validAccessToken: true })
    }

    render() {
        console.log("render")
        if (this.state.noGo)
            return (<></>)

        if (!this.state.validAccessToken)
            return (
                <Layout>
                    <Login handleAccessToken={this.handleAccessToken} />
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
                    <Route component={PageNotFound} />
                </Switch>
            </Layout>
        );
    }
}
