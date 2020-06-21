import React from "react"
import { connect } from "react-redux"
import { Container, Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"
import "./Filter.css"

class Filter extends React.Component {
    constructor(props) {
        super(props)

        const parameters = new URL(document.location.href).searchParams
        const conf = JSON.parse(localStorage.getItem("configuration"))

        let year = { id: "", value: "Todos" }, semester = { id: "", value: "Todos" }, unit = { id: "", value: "Todas" }, season = { id: "", value: "Todas" }

        if (parameters.get("year") !== null) {
            const obj = conf.curricularYears.find(item => item.id === parameters.get("year"))
            if (obj !== undefined)
                year = { id: parameters.get("year"), value: obj.value }
        }

        if (parameters.get("semester") !== null) {
            const obj = conf.semesters.find(item => item.id === parameters.get("semester"))
            if (obj !== undefined)
                semester = { id: parameters.get("semester"), value: obj.value }
        }

        if (parameters.get("unit") !== null) {
            const obj = conf.curricularUnits.find(item => item.id === parameters.get("unit"))
            if (obj !== undefined)
                unit = { id: parameters.get("unit"), value: obj.value }
        }

        if (parameters.get("season") !== null) {
            const obj = conf.seasons.find(item => item.id === parameters.get("season"))
            if (obj !== undefined)
                season = { id: parameters.get("season"), value: obj.value }
        }

        this.state = {
            conf: conf,
            urlParams: parameters,
            selCurricularYear: year,
            selSemester: semester,
            selCurricularUnit: unit,
            selSeason: season,
            cssLabels: { lineHeight: 37 + "px" }
        }

        this.props.dispatch({ type: "FILTER", payload: { year: year, semester: semester, unit: unit, season: season } })
    }

    handleFilter = (type, id, value) => {
        switch (type) {
            case "year":
                this.props.dispatch({ type: "FILTER", payload: { year: { id: id, value: value }, semester: this.state.selSemester, unit: this.state.selCurricularUnit, season: this.state.selSeason } })
                this.setState({ selCurricularYear: { id: id, value: value } })
                break
            case "semester":
                this.props.dispatch({ type: "FILTER", payload: { year: this.state.selCurricularYear, semester: { id: id, value: value }, unit: this.state.selCurricularUnit, season: this.state.selSeason } })
                this.setState({ selSemester: { id: id, value: value } })
                break
            case "unit":
                this.props.dispatch({ type: "FILTER", payload: { year: this.state.selCurricularYear, semester: this.state.selSemester, unit: { id: id, value: value }, season: this.state.selSeason } })
                this.setState({ selCurricularUnit: { id: id, value: value } })
                break
            case "season":
                this.props.dispatch({ type: "FILTER", payload: { year: this.state.selCurricularYear, semester: this.state.selSemester, unit: this.state.selCurricularUnit, season: { id: id, value: value } } })
                this.setState({ selSeason: { id: id, value: value } })
                break
            default:
        }

        let parameters = new URL(document.location.href).searchParams
        const prevParameters = parameters.toString()

        if (id === "")
            parameters.delete(type)
        else
            parameters.set(type, id)

        if (prevParameters !== parameters.toString())
            window.history.pushState({ "unit": type, "value": value }, "", parameters.toString() !== "" ? "?" + parameters.toString() : "")
    }

    render() {

        return (
            <div className="filter" >
                <Container style={{ marginTop: 0 }}>
                    <Row>
                        <Col xs="2">
                            <ul className="nav">
                                <li className="nav-item" style={this.state.cssLabels}>Ano:</li>
                                <li className="nav-item">
                                    <UncontrolledDropdown setActiveFromChild style={{ float: "right" }}>
                                        <DropdownToggle tag="a" className="nav-link" caret>{this.props.filter.year.value}</DropdownToggle>
                                        <DropdownMenu className="dropdown">
                                            <DropdownItem onClick={() => this.handleFilter("year", "", "Todos")} className="dropdown-item">Todos</DropdownItem>
                                            {this.state.conf.curricularYears.map(year => <DropdownItem key={year.id} onClick={() => this.handleFilter("year", year.id, year.value)}>{year.value}</DropdownItem>)}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </li>
                            </ul>
                        </Col>
                        <Col xs="3">
                            <ul className="nav">
                                <li className="nav-item" style={this.state.cssLabels}>Semestre:</li>
                                <li className="nav-item">
                                    <UncontrolledDropdown setActiveFromChild style={{ float: "right" }}>
                                        <DropdownToggle tag="a" className="nav-link" caret>{this.props.filter.semester.value}</DropdownToggle>
                                        <DropdownMenu className="dropdown">
                                            <DropdownItem onClick={() => this.handleFilter("semester", "", "Todos")} className="dropdown-item">Todos</DropdownItem>
                                            {this.state.conf.semesters.map(semester => <DropdownItem key={semester.id} onClick={() => this.handleFilter("semester", semester.id, semester.value)}>{semester.value}</DropdownItem>)}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </li>
                            </ul>
                        </Col>
                        <Col xs="4">
                            <ul className="nav">
                                <li className="nav-item" style={this.state.cssLabels}>Disciplina:</li>
                                <li className="nav-item">
                                    <UncontrolledDropdown setActiveFromChild style={{ float: "right", maxWidth: 18 + "em" }}>
                                        <DropdownToggle tag="a" className="nav-link" caret>{this.props.filter.unit.value}</DropdownToggle>
                                        <DropdownMenu className="dropdown">
                                            <DropdownItem onClick={() => this.handleFilter("unit", "", "Todas")} className="dropdown-item">Todas</DropdownItem>
                                            {this.state.conf.curricularUnits.map(unit => <DropdownItem key={unit.id} onClick={() => this.handleFilter("unit", unit.id, unit.value)}>{unit.value}</DropdownItem>)}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </li>
                            </ul>
                        </Col>
                        <Col xs="3">
                            <ul className="nav">
                                <li className="nav-item" style={this.state.cssLabels}>Época:</li>
                                <li className="nav-item">
                                    <UncontrolledDropdown setActiveFromChild style={{ float: "right" }}>
                                        <DropdownToggle tag="a" className="nav-link" caret>{this.props.filter.season.value}</DropdownToggle>
                                        <DropdownMenu className="dropdown">
                                            <DropdownItem onClick={() => this.handleFilter("season", "", "Todas")} className="dropdown-item">Todas</DropdownItem>
                                            {this.state.conf.seasons.map(season => <DropdownItem key={season.id} onClick={() => this.handleFilter("season", season.id, season.value)}>{season.value}</DropdownItem>)}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        filter: state.filter
    }
}

export default connect(mapStateToProps)(Filter)