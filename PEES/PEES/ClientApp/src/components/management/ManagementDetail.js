import React, { Component } from 'react';
import { Container, Row, Col, CardDeck } from "reactstrap";

import ManagementCard from './ManagementCard'

import './custom.css'

export default class ManagementDetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            configuration: null,
            isLoading: true
        }

        this.handleStateChange = this.handleStateChange.bind(this)
    }

    componentDidMount() {
        this.setState({ isLoading: true })

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

    handleStateChange(newItem, card) {

        this.setState(prevState => {
            let newConfig = prevState.configuration

            let auxConfig = (card === 'semesters' ? newConfig.semesters : (card === 'seasons' ? newConfig.seasons : (card === 'instructionTypes' ? newConfig.instructionTypes : newConfig.curricularUnits)))
            auxConfig = auxConfig.map(item => {
                newItem.isChange = (item.id === newItem.id && item.value !== newItem.value)
                return item.id === newItem.id ? newItem : item
            });

            newConfig.semesters = card === 'semesters' ? auxConfig : newConfig.semesters
            newConfig.seasons = card === 'seasons' ? auxConfig : newConfig.seasons
            newConfig.instructionTypes = card === 'instructionTypes' ? auxConfig : newConfig.instructionTypes
            newConfig.curricularUnits = card === 'curricularUnits' ? auxConfig : newConfig.curricularUnits

            return { configuration: newConfig }
        })
    }

    render() {
        if (this.state.isLoading) {
            return <p>Loading ...</p>;
        }

        const cardCurricularYears = this.state.configuration.curricularYears.map(year =>
            <ManagementCard key={year} value={year} item={year} handleStateChange={this.handleStateChange} />)
        const cardSemesters = this.state.configuration.semesters.map(semester =>
            <ManagementCard key={semester.id} value={semester.value} item={semester} card='semesters' handleStateChange={this.handleStateChange} />)
        const cardSeasons = this.state.configuration.seasons.map(season =>
            <ManagementCard key={season.id} value={season.value} item={season} card='seasons' handleStateChange={this.handleStateChange} />)
        const cardNumeringTypes = this.state.configuration.numeringTypes.map(numeringType =>
            <ManagementCard key={numeringType.id} value={numeringType.value} item={numeringType} card='numeringTypes' handleStateChange={this.handleStateChange} disabled={true} />)
        const cardInstructionTypes = this.state.configuration.instructionTypes.map(instructionType =>
            <ManagementCard key={instructionType.id} value={instructionType.value} item={instructionType} card='instructionsTypes' handleStateChange={this.handleStateChange} />)
        const cardCurricularUnits = this.state.configuration.curricularUnits.map(unit =>
            <ManagementCard key={unit.id} value={unit.value} item={unit} large={true} card='curricularUnits' handleStateChange={this.handleStateChange} />)

        return (
            <Container>
                <Row className="main-card-border">
                    <Col><h4>Anos curriculares</h4></Col>
                </Row>
                <Row style={{ marginBottom: 20 + 'px' }}><Col><CardDeck style={{ display: 'flex', flexDirection: 'row' }}>{cardCurricularYears}</CardDeck></Col></Row>
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