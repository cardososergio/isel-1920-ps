import React, { Component } from 'react';
import { Card, CardBody, CardText } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import ContentEditable from 'react-contenteditable'

import './custom.css'

export default class ManagementCad extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value.toString()
        }
    }

    handleDelete(value) {
        console.log(value)
    }

    render() {
        return (
            <Card className={this.props.large ? 'large' : null}>
                <CardBody>
                    <FontAwesomeIcon icon={faTimes} value={this.state.value} onClick={() => this.handleDelete(this.state.value)} />
                    <CardText>
                        <ContentEditable
                            //innerRef={this.contentEditable}
                            html={this.state.value} // innerHTML of the editable div
                            disabled={false}       // use true to disable editing
                            //onChange={this.handleChange} // handle innerHTML change
                            tagName='span' // Use a custom HTML tag (uses a div by default)
                            className={this.props.large ? 'large' : null}
                        />
                    </CardText>
                </CardBody>
            </Card>
            )
    }
}