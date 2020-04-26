import React from 'react';
import { Form, Button, FormGroup, Input, Label, Container, Row, Col } from "reactstrap";

export default class Login extends React.Component {
    constructor(props) {
        super(props)

        this.email = ''
        this.password = ''

        this.state = {
            enableButton: false,
            header: this.props.header !== undefined ? this.props.header : "Login",
            normalLogin: this.props.header === undefined
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
                    if (this.state.normalLogin) {
                        this.props.history.push("/")
                        localStorage.setItem("isOffline", false)
                    }
                    else
                        this.props.handleStateChange()
                    return
                }
                    
                return Promise.reject(response.statusText)
            })
            .catch(error => {
                alert("Não foi possível autenticar!")
            });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col sm="12" md={{ size: 4, offset: 4 }} className="text-center" style={{marginTop: 50 + 'px'}}>
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
            </Container>
        );
    }
}
