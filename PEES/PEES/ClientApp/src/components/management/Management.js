import React from 'react';
import Cookies from 'js-cookie'

import Login from '../Login'
import ManagementDetail from './ManagementDetail'

export class Management extends React.Component {

    constructor() {
        super();

        this.state = {
            managementToken: Cookies.get('ManagementToken')
        };

        this.handleStateChange = this.handleStateChange.bind(this);
    }

    handleStateChange(value) {
        Cookies.set('ManagementToken', value)
        this.setState({ managementToken: value })
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