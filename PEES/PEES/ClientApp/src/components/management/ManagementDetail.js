import React, { Component } from 'react'
import { Container, Row, Col, CardDeck } from "reactstrap"
import ContentEditable from 'react-contenteditable'

import ManagementCard from './ManagementCard'
import Toast from '../Toast'

import './custom.css'

export default class ManagementDetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            configuration: null,
            isLoading: true,
            toast: {
                visible: false,
                msg: ""
            }
        }

        this.handleSchoolNameChange = this.handleSchoolNameChange.bind(this)
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

    handleSchoolNameChange(e) {

        let toast
        if (e.target.value.length === 0)
            toast = { visible: true, msg: "Validar os campos assinalados" }
        else
            toast = { visible: false, msg: "" }

        this.setState(prevState => {
            let newConfig = prevState.configuration
            newConfig.schoolName = e.target.value

            return { configuration: newConfig, toast: toast }
        })
    }

    handleStateChange() {
        this.setState(prevState => { return { configuration: prevState.configuration } })
    }

    render() {
        if (this.state.isLoading) {
            return <p>Loading ...</p>;
        }

        const cardCurricularYears = this.state.configuration.curricularYears.map(year => !year.isDelete && <ManagementCard
            key={'curricularYears' + year.id}
            value={year.value}
            item={year}
            card='curricularYears'
            handleStateChange={this.handleStateChange} />)
        const cardSemesters = this.state.configuration.semesters.map(semester => !semester.isDelete && <ManagementCard
            key={'semesters' + semester.id}
            value={semester.value}
            item={semester}
            card='semesters'
            handleStateChange={this.handleStateChange} />)
        const cardSeasons = this.state.configuration.seasons.map(season => !season.isDelete && <ManagementCard
            key={'seasons' + season.id}
            value={season.value}
            item={season}
            card='seasons'
            handleStateChange={this.handleStateChange} />)
        const cardNumeringTypes = this.state.configuration.numeringTypes.map(numeringType => !numeringType.isDelete && <ManagementCard
            key={'numeringTypes' + numeringType.id}
            value={numeringType.value}
            item={numeringType}
            card='numeringTypes'
            handleStateChange={this.handleStateChange} disabled={true} />)
        const cardInstructionTypes = this.state.configuration.instructionTypes.map(instructionType => !instructionType.isDelete && <ManagementCard
            key={'instructionTypes' + instructionType.id}
            value={instructionType.value}
            item={instructionType}
            card='instructionsTypes'
            handleStateChange={this.handleStateChange} />)
        const cardCurricularUnits = this.state.configuration.curricularUnits.map(unit => !unit.isDelete && <ManagementCard
            key={'curricularUnits' + unit.id}
            value={unit.value}
            item={unit}
            large={true}
            card='curricularUnits'
            handleStateChange={this.handleStateChange} />)

        return (
            <Container>
                <Row>
                    <Col><Toast msg={this.state.toast.msg} visible={this.state.toast.visible} /></Col>
                </Row>
                <Row className="main-card-border">
                    <Col><h4>Estabelecimento escolar</h4></Col>
                </Row>
                <Row style={{ marginBottom: 20 + 'px' }}>
                    <Col>
                        <ContentEditable
                            html={this.state.configuration.schoolName}
                            onChange={this.handleSchoolNameChange}
                            tagName='span'
                            className='input-text'
                        />
                    </Col>
                </Row>
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