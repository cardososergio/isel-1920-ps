import React from 'react'
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import { Container, Row, Col, CardDeck } from "reactstrap"
import ContentEditable from 'react-contenteditable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import ManagementCard from './ManagementCard'
import * as Utils from "../global/Utils"
import './custom.css'

class ManagementDetail extends React.Component {
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

        this.handleStateChange = this.handleStateChange.bind(this)
        this.handleSaveConfiguration = this.handleSaveConfiguration.bind(this)
        this.handleNewItem = this.handleNewItem.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
    }

    componentDidMount() {
        this.setState({ isLoading: true })

        fetch('/api/management')
            .then(response => { if (response.status === 200) return response.json(); return Promise.reject(response.statusText) })
            .then(data => {
                this.setState({ configuration: data, isLoading: false })
            })
            .catch(error => {
                console.error(error)
                this.props.dispatch(Utils.Toast("Não foi possível ligar à base de dados!", Utils.ToastTypes.Danger, true))
            })
    }

    handleStateChange() {
        this.setState(prevState => { return { ...prevState, toast: { ...prevState.toast, visible: this.checkForErrors() } } })
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
        let result, j
        result = ''

        for (j = 0; j < 32; j++) {
            if (j === 8 || j === 12 || j === 16 || j === 20)
                result = result + '-'

            result += Math.floor(Math.random() * 16).toString(16).toUpperCase()
        }

        return result
    }

    handleNewItem(e) {
        let prev = this.state.configuration

        switch (e) {
            case "curricularYears":
                prev.curricularYears.push({ id: this.generateGuid(), value: "", isNew: true, isChange: false, isDelete: false, gotError: true })
                break;
            case "semesters":
                prev.semesters.push({ id: this.generateGuid(), value: "", isNew: true, isChange: false, isDelete: false, gotError: true })
                break;
            case "seasons":
                prev.seasons.push({ id: this.generateGuid(), value: "", isNew: true, isChange: false, isDelete: false, gotError: true })
                break;
            case "instructionTypes":
                prev.instructionTypes.push({ id: this.generateGuid(), value: "", isNew: true, isChange: false, isDelete: false, gotError: true })
                break;
            case "curricularUnits":
                prev.curricularUnits.push({ id: this.generateGuid(), value: "", isNew: true, isChange: false, isDelete: false, gotError: true })
                break;
            default:
        }

        this.setState(prevState => { return { configuration: prev, toast: { visible: true, msg: prevState.toast.msg } } })
    }

    handleKeyDown(e) {
        if (e.keyCode === 13) e.preventDefault()
    }

    handleBlur(e) {
        const schoolName = e.target.innerText

        this.setState(prevState => {
            let newConfig = prevState.configuration

            if (newConfig.schoolName === schoolName)
                return null

            newConfig.schoolName = schoolName

            return {
                configuration: newConfig, toast: { visible: this.checkForErrors(), msg: prevState.toast.msg }
            }
        })
    }

    handleSaveConfiguration(e) {
        if (this.state.toast.visible) {
            this.props.dispatch(Utils.Toast("Falta resolver os alertas pendentes", Utils.ToastTypes.Warning, false))
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

        this.setState({ isLoading: true })

        fetch('/api/management', requestOptions)
            .then(response => {
                if (response.status === 200) return response.json();

                return Promise.reject(response.statusText)
            })
            .then(data => {
                this.props.dispatch(Utils.Toast("Dados gravados", Utils.ToastTypes.Success, false))

                this.setState({ configuration: data, isLoading: false })

            })
            .catch(error => {
                console.error(error)
                this.props.dispatch(Utils.Toast("Houve problemas ao gravar os dados!", Utils.ToastTypes.Danger, true))
            })
    }

    render() {
        if (this.state.isLoading)
            return <p className="content container">A carregar os dados...</p>

        const cardCurricularYears = this.state.configuration.curricularYears.map((year, index) => !year.isDelete && <ManagementCard
            key={"curricularYears" + index}
            value={year.value}
            item={year}
            card='curricularYears'
            handleStateChange={this.handleStateChange} />)
        const cardSemesters = this.state.configuration.semesters.map((semester, index) => !semester.isDelete && <ManagementCard
            key={'semesters' + index}
            value={semester.value}
            item={semester}
            card='semesters'
            handleStateChange={this.handleStateChange} />)
        const cardSeasons = this.state.configuration.seasons.map((season, index) => !season.isDelete && <ManagementCard
            key={'seasons' + index}
            value={season.value}
            item={season}
            card='seasons'
            handleStateChange={this.handleStateChange} />)
        const cardNumeringTypes = this.state.configuration.numeringTypes.map((numeringType, index) => !numeringType.isDelete && <ManagementCard
            key={'numeringTypes' + index}
            value={numeringType.value}
            item={numeringType}
            card='numeringTypes'
            handleStateChange={this.handleStateChange} disabled={true} />)
        const cardInstructionTypes = this.state.configuration.instructionTypes.map((instructionType, index) => !instructionType.isDelete && <ManagementCard
            key={'instructionTypes' + index}
            value={instructionType.value}
            item={instructionType}
            card='instructionsTypes'
            handleStateChange={this.handleStateChange} />)
        const cardCurricularUnits = this.state.configuration.curricularUnits.map((unit, index) => !unit.isDelete && <ManagementCard
            key={'curricularUnits' + index}
            value={unit.value}
            item={unit}
            large={true}
            card='curricularUnits'
            handleStateChange={this.handleStateChange} />)

        return (
            <>
                <Link to="#" title="Gravar" onClick={this.handleSaveConfiguration}><FontAwesomeIcon icon={faCloudUploadAlt} /></Link>

                <Container>
                    <Row className="main-card-border">
                        <Col><h4>Estabelecimento escolar</h4></Col>
                    </Row>
                    <Row style={{ marginBottom: 20 + 'px' }}>
                        <Col className={this.state.configuration.schoolName.length === 0 ? "got-error" : null}>
                            <ContentEditable
                                html={this.state.configuration.schoolName}
                                tagName='span'
                                className='input-text'
                                onKeyDown={this.handleKeyDown} onBlur={this.handleBlur}
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
        )
    }
}

export default connect()(ManagementDetail)