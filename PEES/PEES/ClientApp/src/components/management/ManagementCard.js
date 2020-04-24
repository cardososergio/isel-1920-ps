import React from 'react';
import { Card, CardBody, CardText } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import ContentEditable from 'react-contenteditable'

import './custom.css'

export default class ManagementCad extends React.Component {
    constructor(props) {
        super(props)

        this.handleDelete = this.handleDelete.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
    }

    handleDelete() {
        let newItem = this.props.item
        newItem.isDelete = true
        newItem.gotError = false

        this.props.handleStateChange()
    }

    handleKeyDown(e) {
        if (e.keyCode === 13) {
            e.preventDefault()
        }
    }

    handleBlur(e) {
        const value = e.target.innerText
        let newItem = this.props.item

        if (value === newItem.value)
            return

        newItem.value = value
        newItem.isChange = true
        newItem.gotError = value.length === 0

        if (!newItem.gotError && this.props.card === "curricularYears")
            newItem.gotError = isNaN(value) || !Number.isInteger(+value) || (+value <= 0)

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
                            tagName='span'
                            className={this.props.large ? 'large' : null}
                            onKeyDown={this.handleKeyDown} onBlur={this.handleBlur}
                        />
                    </CardText>
                </CardBody>
            </Card>
        );
    }
}