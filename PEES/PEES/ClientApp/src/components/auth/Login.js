import React from 'react';
import { Form, Button, FormGroup, Input, Label, Container, Row, Col } from "reactstrap";
import { Link } from 'react-router-dom';
import NewUser from './NewUser';

export default class Login extends React.Component {
    constructor(props) {
        super(props)

        this.email = ''
        this.password = ''

        this.state = {
            enableButton: false,
            header: this.props.header !== undefined ? this.props.header : "Login",
            normalLogin: this.props.header === undefined,
            register: false
        }

        this.handleRegister = this.handleRegister.bind(this)
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

                return Promise.reject(response.statusText)
            })
            .then(json => {
                if (json.userId !== undefined) {
                    localStorage.setItem("isOffline", false)
                    localStorage.setItem("user", JSON.stringify({ userId: json.userId, name: json.name }))

                    this.props.handleAccessToken()
                }
                else
                    this.props.handleStateChange()
            })
            .catch(error => {
                alert("Não foi possível autenticar!")
            });
    }

    handleRegister() {
        this.setState({ register: false })
    }

    render() {
        if (this.state.register)
            return (<NewUser handleRegister={this.handleRegister} />)

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
                <Row style={{ marginTop: 0.5 + "em" }}>
                    <Col className="text-center">
                        <Link to="#" onClick={(e) => { e.preventDefault(); this.setState({ register: true }); }}>novo registo</Link>
                    </Col>
                </Row>
            </Container>
        );
    }
}
