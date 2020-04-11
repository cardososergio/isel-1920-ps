import React, { Component } from 'react';

import Login from './Login'

export class Management extends Component {

    constructor() {
        super();

        this.state = { "managementToken": undefined };

        this.handleStateChange = this.handleStateChange.bind(this);
    }

    handleStateChange(value) {
        this.setState({ "managementToken": value })
    }

    render() {
        return (
            <>
                {(this.state.managementToken === undefined ? <Login handleStateChange={this.handleStateChange} /> : <h1>{this.state.managementToken}</h1>)}
            </>
        );
    }
}