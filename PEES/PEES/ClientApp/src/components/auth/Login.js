import React from 'react'
import { connect } from "react-redux"
import { Form, Button, FormGroup, Input, Label, Container, Row, Col } from "reactstrap"
import { Link, Redirect } from 'react-router-dom'
import * as Utils from "../global/Utils"
import Cookies from "js-cookie"

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.email = ""
        this.password = ""

        this.state = {
            enableButton: false,
            header: this.props.header !== undefined ? this.props.header : "Login",
            normalLogin: this.props.header === undefined,
            validUser: false
        }
    }

    validateForm = () => {
        this.setState({ enableButton: this.email.length > 0 && this.password.length > 0 })
    }

    handleSubmit = event => {
        event.preventDefault()

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'email': this.email, 'password': this.password })
        };

        const url = this.state.normalLogin ? "/api/users/login" : "/api/management/login"
        fetch(url, requestOptions)
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                }

                return Promise.reject(response.statusText);
            })
            .then(json => {
                if (!this.state.normalLogin) {
                    if (json.userId !== null)
                        this.handleStateChange();
                }

                if (json.userId !== undefined && json.userId !== null) {
                    localStorage.setItem("isOffline", false)
                    localStorage.setItem("user", JSON.stringify({ userId: json.userId, name: json.name }))

                    Cookies.remove("ViewOnlyToken")
                    this.props.dispatch({ type: "VIEW_ONLY", payload: false })

                    this.setState({ validUser: true })
                }
                else {
                    this.props.dispatch(Utils.Toast("Credenciais inválidas!", Utils.ToastTypes.Warning, false))
                }
            })
            .catch(error => {
                console.error(error)
                this.props.dispatch(Utils.Toast("Não foi possível autenticar!", Utils.ToastTypes.Danger, true))
            });
    }

    handleStateChange() {
        this.props.handleStateChange()
    }

    render() {

        if (this.state.validUser && this.state.normalLogin)
            return (<Redirect to="/" />)
        if (this.state.validUser && !this.state.normalLogin)
            return (<Redirect to="/management" />)

        return (
            <Container>
                <Row>
                    <Col sm="12" md={{ size: 4, offset: 4 }} className="text-center" style={{ marginTop: 50 + 'px' }}>
                        <h2>{this.state.header}</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" md={{ size: 4, offset: 4 }}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label>Email</Label>
                                <Input id="txtEmail" autoFocus type="email" onChange={e => { this.email = e.target.value; this.validateForm() }} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Password</Label>
                                <Input id="txtPassword" onChange={e => { this.password = e.target.value; this.validateForm() }} type="password" />
                            </FormGroup>
                            <Button block disabled={!this.state.enableButton} type="submit" color="primary">Login</Button>
                        </Form>
                    </Col>
                </Row>
                {
                    this.state.normalLogin ?
                        <Row style={{ marginTop: 0.5 + "em" }}>
                            <Col className="text-center">
                                <Link to="/newuser">novo registo</Link>
                            </Col>
                        </Row>
                        : null
                }
            </Container>
        );
    }
}

export default connect()(Login)