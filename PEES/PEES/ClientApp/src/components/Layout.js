import React from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export class Layout extends React.Component {
    static displayName = Layout.name;

    render() {
        return (
            <div>
                <NavMenu />
                <Container className="content" style={{ top: 60 + "px" }}>
                    {this.props.children}
                </Container>
            </div>
        );
    }
}
