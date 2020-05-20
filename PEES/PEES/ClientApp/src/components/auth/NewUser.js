import React, { useState } from "react"
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Redirect } from "react-router-dom";

const NewUser = (props) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [registerDone, setRegisterDone] = useState(false)

    const handleSubmit = event => {
        event.preventDefault()

        if (!(name.length > 0 && email.length > 0 && password.length > 0 && confirm.length > 0)) {
            alert("Dados incompletos!")
            return
        }

        if (password !== confirm) {
            alert("Password errada")
            return
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "name": name, "email": email, "password": password })
        }

        fetch("/api/users/newuser", requestOptions)
            .then(response => { if (response.status === 200) return response.json(); return Promise.reject(response.statusText); })
            .then(json => {
                if (!json) {
                    alert('Endereço de e-mail já existente!')
                    return
                }

                setRegisterDone(true)
            })
            .catch(error => {
                alert("Não foi possível criar o utilizador!")
            });
    }

    if (registerDone)
        return (<Redirect to="/login" />)

    return (
        <Container>
            <Row>
                <Col sm="12" md={{ size: 4, offset: 4 }} className="text-center" style={{ marginTop: 50 + 'px' }}>
                    <h2>Registo</h2>
                </Col>
            </Row>
            <Row>
                <Col sm="12" md={{ size: 4, offset: 4 }}>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label>Nome</Label>
                            <Input id="txtName" autoFocus type="text" onChange={e => { setName(e.target.value) }} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input id="txtEmail2" type="email" onChange={e => { setEmail(e.target.value) }} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Password</Label>
                            <Input id="txtPassword2" onChange={e => { setPassword(e.target.value) }} type="password" />
                        </FormGroup>
                        <FormGroup>
                            <Label>Confirmação</Label>
                            <Input id="txtConfirm" onChange={e => { setConfirm(e.target.value) }} type="password" />
                        </FormGroup>
                        <Button block type="submit" color="primary">Criar</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default NewUser