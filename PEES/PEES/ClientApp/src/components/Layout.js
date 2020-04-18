import React from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export class Layout extends React.Component {
    static displayName = Layout.name;

    render() {
        return (
            <div>
                <NavMenu />
                <Container className="content">
                    {this.props.children}
                </Container>
            </div>
        );
    }
}
