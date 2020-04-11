import React, { Component } from 'react';
import { Container, Row, Col, CardDeck, Card, CardBody, CardText } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import ContentEditable from 'react-contenteditable'

import './custom.css'

export default class ManagementDetail extends Component {
        constructor(props) {
            super(props);

            this.state = {
                html: '2000'
            }
        }

    /*componentDidMount() {
        fetch('/api/management')
            .then(response => response.json())
            .then(data => {

            })
            .catch(error => {
                this.setState({ errorMessage: error });
                console.error('There was an error!', error);
            })
    }*/

    handleDelete(value) {
        console.log(value)
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h4>Anos curriculares</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CardDeck style={{ display: 'flex', flexDirection: 'row' }}>
                            <Card>
                                <CardBody>
                                    <FontAwesomeIcon icon={faTimes} value="2019" onClick={() => this.handleDelete(2019)} />
                                    <CardText>
                                        <ContentEditable
                                            //innerRef={this.contentEditable}
                                            html={this.state.html} // innerHTML of the editable div
                                            disabled={false}       // use true to disable editing
                                            //onChange={this.handleChange} // handle innerHTML change
                                            tagName='span' // Use a custom HTML tag (uses a div by default)
                                        />
                                    </CardText>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <FontAwesomeIcon icon={faTimes} />
                                    <CardText>2019</CardText>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <FontAwesomeIcon icon={faTimes} />
                                    <CardText>2019</CardText>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <FontAwesomeIcon icon={faTimes} />
                                    <CardText>2019</CardText>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <FontAwesomeIcon icon={faTimes} />
                                    <CardText>2019</CardText>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <FontAwesomeIcon icon={faTimes} />
                                    <CardText>2019</CardText>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <FontAwesomeIcon icon={faTimes} />
                                    <CardText>2019</CardText>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <FontAwesomeIcon icon={faTimes} />
                                    <CardText>2019</CardText>
                                </CardBody>
                            </Card>
                        </CardDeck>
                    </Col>
                </Row>
            </Container>
        );
    }
}