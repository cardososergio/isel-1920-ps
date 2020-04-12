import React, { Component } from 'react';
import { Card, CardBody, CardText } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import ContentEditable from 'react-contenteditable'

import './custom.css'

export default class ManagementCad extends Component {
    constructor(props) {
        super(props);

        this.contentEditable = React.createRef()

        this.handleChange = this.handleChange.bind(this)
    }

    handleDelete(value) {
        console.log(value)
    }

    handleChange(e) {
        let newItem = this.props.item
        newItem.value = e.target.value

        this.props.handleStateChange(newItem, this.props.card)
    }

    render() {
        return (
            <Card className={this.props.large ? 'large' : null}>
                <CardBody>
                    {this.props.disabled !== true && <FontAwesomeIcon icon={faTimes} value={this.props.item.id} onClick={() => this.handleDelete(this.props.item.id)} />}
                    <CardText>
                        <ContentEditable
                            innerRef={this.contentEditable}
                            html={this.props.value.toString()} // innerHTML of the editable div
                            disabled={this.props.disabled ? true : false}
                            onChange={this.handleChange} // handle innerHTML change
                            tagName='span' // Use a custom HTML tag (uses a div by default)
                            className={this.props.large ? 'large' : null}
                        />
                    </CardText>
                </CardBody>
            </Card>
        );
    }
}