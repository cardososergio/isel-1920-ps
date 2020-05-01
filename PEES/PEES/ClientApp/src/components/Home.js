import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { connect } from "react-redux"
import { Filter } from './Filter'
import { UnitsCard } from "./UnitsCard"
import { UnitsList } from "./UnitsList"
import "./Home.css"

class Home extends React.Component {
    static displayName = Home.name;

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Filter />
                    </Col>
                </Row>
                <Row style={{ marginTop: 1 + "em" }}>
                    <Col>
                        {this.props.unitsView === "card" ? <UnitsCard /> : <UnitsList />}
                    </Col>
                </Row>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        filter: state.filter,
        unitsView: state.unitsView
    }
}

export default connect(mapStateToProps)(Home)