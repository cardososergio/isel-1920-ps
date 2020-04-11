import React, { Component } from 'react';
import { Container, Row, Col, CardDeck } from "reactstrap";

import ManagementCard from './ManagementCard'

import './custom.css'

export default class ManagementDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            configuration: null,
            isLoading: true
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true, configuration: null })

        fetch('/api/management')
            .then(response => response.json())
            .then(data => {
                this.setState({ configuration: data, isLoading: false });
            })
            .catch(error => {
                this.setState({ errorMessage: error });
                console.error('There was an error!', error);
            })
    }

    render() {
        if (this.state.isLoading) {
            return <p>Loading ...</p>;
        }

        const cardCurricularYears = this.state.configuration.curricularYears.map(year => <ManagementCard key={year} value={year} />)
        const cardSemesters = this.state.configuration.semesters.map(semester => <ManagementCard key={semester.id} value={semester.value} />)
        const cardSeasons = this.state.configuration.seasons.map(season => <ManagementCard key={season.id} value={season.value} />)
        const cardNumeringTypes = this.state.configuration.numeringTypes.map(numeringType => <ManagementCard key={numeringType.id} value={numeringType.value} />)
        const cardInstructionTypes = this.state.configuration.instructionTypes.map(instructionType => <ManagementCard key={instructionType.id} value={instructionType.value} />)
        const cardCurricularUnits = this.state.configuration.curricularUnits.map(unit => <ManagementCard key={unit.id} value={unit.value} large={true} />)

        return (
            <Container>
                <Row className="main-card-border">
                    <Col><h4>Anos curriculares</h4></Col>
                </Row>
                <Row style={{marginBottom: 20 +'px'}}><Col><CardDeck style={{ display: 'flex', flexDirection: 'row' }}>{cardCurricularYears}</CardDeck></Col></Row>
                <Row className="main-card-border">
                    <Col><h4>Semestres</h4></Col>
                </Row>
                <Row style={{ marginBottom: 20 + 'px' }}><Col><CardDeck style={{ display: 'flex', flexDirection: 'row' }}>{cardSemesters}</CardDeck></Col></Row>
                <Row className="main-card-border">
                    <Col><h4>Épocas</h4></Col>
                </Row>
                <Row style={{ marginBottom: 20 + 'px' }}><Col><CardDeck style={{ display: 'flex', flexDirection: 'row' }}>{cardSeasons}</CardDeck></Col></Row>
                <Row className="main-card-border">
                    <Col><h4>Tipos de pergunta</h4></Col>
                </Row>
                <Row style={{ marginBottom: 20 + 'px' }}><Col><CardDeck style={{ display: 'flex', flexDirection: 'row' }}>{cardNumeringTypes}</CardDeck></Col></Row>
                <Row className="main-card-border">
                    <Col><h4>Tipos de enunciado</h4></Col>
                </Row>
                <Row style={{ marginBottom: 20 + 'px' }}><Col><CardDeck style={{ display: 'flex', flexDirection: 'row' }}>{cardInstructionTypes}</CardDeck></Col></Row>
                <Row className="main-card-border">
                    <Col><h4>Disciplinas</h4></Col>
                </Row>
                <Row><Col><CardDeck style={{ display: 'flex', flexDirection: 'row' }}>{cardCurricularUnits}</CardDeck></Col></Row>
            </Container>
        );
    }
}