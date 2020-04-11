import React, { Component } from 'react';
import { Form, Button, FormGroup, Input, Label, Container, Row, Col } from "reactstrap";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.email = '';
        this.password = '';

        this.state = { "enableButton": false }
    }

    validateForm = () => {
        this.setState({ "enableButton": this.email.length > 0 && this.password.length > 0 });
    }

    handleSubmit = event => {
        event.preventDefault();

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'email': this.email, 'password': this.password })
        };

        fetch('/api/management/login', requestOptions)
            .then(response => response.json())
            .then(data => {
                this.props.handleStateChange(data.token);
            })
            .catch(error => {
                this.setState({ errorMessage: error });
                console.error('There was an error!', error);
            });
    }

    render() {
        return (
            <Container>
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
