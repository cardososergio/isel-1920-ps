import React from 'react'
import { Link } from 'react-router-dom';
import { Container, Row, Col, CardDeck } from "reactstrap"
import ContentEditable from 'react-contenteditable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt, faPlus } from '@fortawesome/free-solid-svg-icons'


import ManagementCard from './ManagementCard'
import Toast from '../Toast'

import './custom.css'

export default class ManagementDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            configuration: null,
            isLoading: true,
            toast: {
                visible: false,
                msg: "Validar os campos assinalados"
            }
        }

        this.handleSchoolNameChange = this.handleSchoolNameChange.bind(this)
        this.handleStateChange = this.handleStateChange.bind(this)
        this.handleSaveConfiguration = this.handleSaveConfiguration.bind(this)
        this.handleNewItem = this.handleNewItem.bind(this)
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

        this.setState(prevState => {
            let newConfig = prevState.configuration
            newConfig.schoolName = e.target.value

            return {
                configuration: newConfig, toast: { visible: this.checkForErrors(), msg: prevState.toast.msg }
            }
        })
    }

    handleStateChange() {
        this.setState(prevState => { return { configuration: prevState.configuration, toast: { visible: this.checkForErrors(), msg: prevState.toast.msg } } })
    }

    checkForErrors() {
        let result = true

        result = this.state.configuration.schoolName.length === 0
        if (!result && this.state.configuration.curricularYears.find(item => item.gotError)) result = true
        if (!result && this.state.configuration.curricularYears.find(item => !item.isDelete && (isNaN(item.value) || !Number.isInteger(+item.value) || (+item.value <= 0)))) result = true // check if is integer
        if (!result && this.state.configuration.semesters.find(item => item.gotError)) result = true
        if (!result && this.state.configuration.seasons.find(item => item.gotError)) result = true
        if (!result && this.state.configuration.instructionTypes.find(item => item.gotError)) result = true
        if (!result && this.state.configuration.curricularUnits.find(item => item.gotError)) result = true

        return result
    }

    generateGuid() {
        var result, i, j;
        result = '';
        for (j = 0; j < 32; j++) {
            if (j === 8 || j === 12 || j === 16 || j === 20)
                result = result + '-';
            i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            result = result + i;
        }
        return result;
    }

    handleNewItem(e) {
        let prev = this.state.configuration
        eval("prev." + e).push({ id: this.generateGuid(), value: "", isNew: true, isChange: false, isDelete: false, gotError: true })
        this.setState(prevState => { return { configuration: prev, toast: { visible: true, msg: prevState.toast.msg } } })
    }

    handleSaveConfiguration(e) {
        if (this.state.toast.visible) {
            alert('Falta resolver os alertas pendentes')
            return
        }

        let conf = Object.create(null)
        conf.curricularYears = this.state.configuration.curricularYears
        conf.curricularUnits = this.state.configuration.curricularUnits
        conf.instructionTypes = this.state.configuration.instructionTypes
        conf.numeringTypes = this.state.configuration.numeringTypes
        conf.seasons = this.state.configuration.seasons
        conf.semesters = this.state.configuration.semesters
        conf.schoolName = this.state.configuration.schoolName
        conf.configurationId = this.state.configuration.configurationId

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(conf)
        };

        fetch('/api/management', requestOptions)
            .then(response => {
                if (response.status === 200) return response.json();

                return Promise.reject(response.statusText)
            })
            .then(data => {
                alert('Dados gravados')
                this.setState({ configuration: data, isLoading: false })
                console.log("done")
            })
            .catch(error => {
                console.error(error)
            })
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
            <>
                <Link to="#" title="Gravar" onClick={this.handleSaveConfiguration}>
                    <FontAwesomeIcon icon={faCloudUploadAlt} />
                </Link>

                <Container>
                    <Row>
                        <Col><Toast msg={this.state.toast.msg} visible={this.state.toast.visible} /></Col>
                    </Row>
                    <Row className="main-card-border">
                        <Col><h4>Estabelecimento escolar</h4></Col>
                    </Row>
                    <Row style={{ marginBottom: 20 + 'px' }}>
                        <Col className={this.state.configuration.schoolName.length === 0 ? "got-error" : null}>
                            <ContentEditable
                                html={this.state.configuration.schoolName}
                                onChange={this.handleSchoolNameChange}
                                tagName='span'
                                className='input-text'
                            />
                        </Col>
                    </Row>
                    <Row className="main-card-border">
                        <Col>
                            <h4>Anos curriculares</h4>
                            <FontAwesomeIcon icon={faPlus} onClick={() => this.handleNewItem("curricularYears")} />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 20 + 'px' }}><Col><CardDeck style={{ display: 'flex', flexDirection: 'row' }}>{cardCurricularYears}</CardDeck></Col></Row>
                    <Row className="main-card-border">
                        <Col>
                            <h4>Semestres</h4>
                            <FontAwesomeIcon icon={faPlus} onClick={() => this.handleNewItem("semesters")} />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 20 + 'px' }}><Col><CardDeck style={{ display: 'flex', flexDirection: 'row' }}>{cardSemesters}</CardDeck></Col></Row>
                    <Row className="main-card-border">
                        <Col>
                            <h4>Épocas</h4>
                            <FontAwesomeIcon icon={faPlus} onClick={() => this.handleNewItem("seasons")} />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 20 + 'px' }}><Col><CardDeck style={{ display: 'flex', flexDirection: 'row' }}>{cardSeasons}</CardDeck></Col></Row>
                    <Row className="main-card-border">
                        <Col>
                            <h4>Tipos de pergunta</h4>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 20 + 'px' }}><Col><CardDeck style={{ display: 'flex', flexDirection: 'row' }}>{cardNumeringTypes}</CardDeck></Col></Row>
                    <Row className="main-card-border">
                        <Col>
                            <h4>Tipos de enunciado</h4>
                            <FontAwesomeIcon icon={faPlus} onClick={() => this.handleNewItem("instructionTypes")} />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 20 + 'px' }}><Col><CardDeck style={{ display: 'flex', flexDirection: 'row' }}>{cardInstructionTypes}</CardDeck></Col></Row>
                    <Row className="main-card-border">
                        <Col>
                            <h4>Disciplinas</h4>
                            <FontAwesomeIcon icon={faPlus} onClick={() => this.handleNewItem("curricularUnits")} />
                        </Col>
                    </Row>
                    <Row><Col><CardDeck style={{ display: 'flex', flexDirection: 'row' }}>{cardCurricularUnits}</CardDeck></Col></Row>
                </Container>
            </>
        );
    }
}