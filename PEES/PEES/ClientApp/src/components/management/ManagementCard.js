import React from 'react';
import { Card, CardBody, CardText } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import ContentEditable from 'react-contenteditable'

import './custom.css'

export default class ManagementCad extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }

    handleDelete(e) {
        let newItem = this.props.item
        newItem.isDelete = true
        newItem.gotError = false

        this.props.handleStateChange()
    }

    handleChange(e) {
        let newItem = this.props.item
        newItem.value = e.target.value
        newItem.isChange = true
        newItem.gotError = e.target.value.length === 0

        this.props.handleStateChange()
    }

    render() {
        return (
            <Card className={this.props.large ? 'large' + (this.props.item.gotError ? ' got-error' : '') : (this.props.item.gotError ? 'got-error' : null)}>
                <CardBody>
                    {this.props.disabled !== true && <FontAwesomeIcon icon={faTimes} value={this.props.item.id} onClick={this.handleDelete} />}
                    <CardText>
                        <ContentEditable
                            html={this.props.value.toString()}
                            disabled={this.props.disabled ? true : false}
                            onChange={this.handleChange}
                            tagName='span'
                            className={this.props.large ? 'large' : null}
                        />
                    </CardText>
                </CardBody>
            </Card>
        );
    }
}