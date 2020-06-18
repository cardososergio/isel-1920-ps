import React from 'react'
import { connect } from "react-redux"
import { Container } from 'reactstrap'
import { NavMenu } from './NavMenu'
import Alerts from './global/Alerts'

class Layout extends React.Component {
    static displayName = Layout.name;

    render() {
        return (
            <div>
                <Alerts attr={this.props.alert} />
                <NavMenu />
                <Container className="content" style={{ top: 60 + "px" }}>
                    {this.props.children}
                </Container>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        alert: state.alert
    }
}

export default connect(mapStateToProps)(Layout)