import React, { Component } from 'react';
import Cookies from 'js-cookie'

import Login from '../Login'
import ManagementDetail from './ManagementDetail'

export class Management extends Component {

    constructor() {
        super();

        this.state = { "managementToken": Cookies.get('managementToken') };

        this.handleStateChange = this.handleStateChange.bind(this);
    }

    handleStateChange(value) {
        this.setState({ "managementToken": value })
        Cookies.set('managementToken', value)
    }

    render() {
        return (
            <>
                {(this.state.managementToken === undefined ?
                    <Login header="Administração" handleStateChange={this.handleStateChange} /> :
                    <ManagementDetail />)}
            </>
        );
    }
}