import React from 'react';
import { Container, Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export class Home extends React.Component {
    static displayName = Home.name;

    constructor(props) {
        super(props)

        this.state = {
            curricularYears: [],
            semesters: [],
            curricularUnits: [],
            seasons: []
        }
    }

    componentDidMount() {
        const conf = JSON.parse(localStorage.getItem("configuration"))

        this.setState({ curricularYears: conf.curricularYears, semesters: conf.semesters, curricularUnits: conf.curricularUnits, seasons: conf.seasons })
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <div style={{ border: "1px solid gray" }}>
                            <Container style={{ marginTop: 0 }}>
                                <Row>
                                    <Col>
                                        <span className="align-middle">Ano:</span>
                                        <UncontrolledDropdown setActiveFromChild style={{ float: "right" }}>
                                            <DropdownToggle tag="a" className="nav-link" caret>Todos</DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Todos</DropdownItem>
                                                {
                                                    this.state.curricularYears.map(year => <DropdownItem key={year.id}>{year.value}</DropdownItem>)
                                                }
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Col>
                                    <Col>
                                        <span className="align-middle">Semestre:</span>
                                        <UncontrolledDropdown setActiveFromChild style={{ float: "right" }}>
                                            <DropdownToggle tag="a" className="nav-link" caret>Todos</DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Todos</DropdownItem>
                                                {
                                                    this.state.semesters.map(semester => <DropdownItem key={semester.id}>{semester.value}</DropdownItem>)
                                                }
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Col>
                                    <Col>
                                        <span className="align-middle">Disciplina:</span>
                                        <UncontrolledDropdown setActiveFromChild style={{ float: "right" }}>
                                            <DropdownToggle tag="a" className="nav-link" caret>Todas</DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Todas</DropdownItem>
                                                {
                                                    this.state.curricularUnits.map(unit => <DropdownItem key={unit.id}>{unit.value}</DropdownItem>)
                                                }
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Col>
                                    <Col>
                                        <span className="align-middle">Época:</span>
                                        <UncontrolledDropdown setActiveFromChild style={{ float: "right" }}>
                                            <DropdownToggle tag="a" className="nav-link" caret>Todas</DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Todas</DropdownItem>
                                                {
                                                    this.state.seasons.map(season => <DropdownItem key={season.id}>{season.value}</DropdownItem>)
                                                }
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}
