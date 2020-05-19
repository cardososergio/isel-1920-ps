import React from 'react';
import Cookies from 'js-cookie'

import Login from '../auth/Login'
import ManagementDetail from './ManagementDetail'

export class Management extends React.Component {

    constructor() {
        super()

        this.state = {
            managementToken: Cookies.get('ManagementToken')
        };

        this.handleStateChange = this.handleStateChange.bind(this);
    }

    handleStateChange() {
        this.setState({ managementToken: "" })
    }

    render() {
        return (
            <>
                {(this.state.managementToken === undefined ?
                    <Login header="Administração" handleStateChange={this.handleStateChange} />
                    :
                    <ManagementDetail />)}
            </>
        );
    }
}