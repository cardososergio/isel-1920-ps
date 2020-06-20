import React, { useState, useEffect } from "react"
import { Container, Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"
//import { useDispatch, useSelector } from "react-redux"
import "./Filter.css"

export const Filter = (props) => {
    //const dispatch = useDispatch()
    //const unitSelected = useSelector(state => state.filter.unit)
    const conf = JSON.parse(localStorage.getItem("configuration"))
    const urlParameters = new URL(document.location.href).searchParams

    const [selCurricularYear, setSelCurricularYear] = useState({ id: "", value: "Todos" })
    const [selSemester, setSelSemester] = useState({ id: "", value: "Todos" })
    //const [selCurricularUnit, setselCurricularUnit] = useState((unitSelected.id === "" ? { id: "", value: "Todas" } : { id: unitSelected.id, value: unitSelected.value }))
    const [selCurricularUnit, setselCurricularUnit] = useState({ id: "", value: "Todas" })
    const [selSeason, setselSeason] = useState({ id: "", value: "Todas" })

    const cssLabels = { lineHeight: 37 + "px" }

    const handleFilter = (type, id, value) => {
        switch (type) {
            case "year":
                //dispatch({ type: "FILTER", payload: { year: { id: id, value: value }, semester: selSemester, unit: selCurricularUnit, season: selSeason } })
                setSelCurricularYear({ id: id, value: value })
                break
            case "semester":
                //dispatch({ type: "FILTER", payload: { year: selCurricularYear, semester: { id: id, value: value }, unit: selCurricularUnit, season: selSeason } })
                setSelSemester({ id: id, value: value })
                break
            case "unit":
                //dispatch({ type: "FILTER", payload: { year: selCurricularYear, semester: selSemester, unit: { id: id, value: value }, season: selSeason } })
                setselCurricularUnit({ id: id, value: value })
                break
            case "season":
                //dispatch({ type: "FILTER", payload: { year: selCurricularYear, semester: selSemester, unit: selCurricularUnit, season: { id: id, value: value } } })
                setselSeason({ id: id, value: value })
                break
            default:
        }

        const url = new URL(document.location.href)
        let parameters = url.searchParams
        const prevParameters = parameters.toString()

        if (id === "")
            parameters.delete(type)
        else
            parameters.set(type, id)

        if (prevParameters !== parameters.toString())
            window.history.pushState({ "unit": type, "value": value }, "", parameters.toString() !== "" ? "?" + parameters.toString() : "")
    }

    useEffect(() => {
        if (urlParameters.get("year") !== null) {
            const obj = conf.curricularYears.find(item => item.id === urlParameters.get("year"))
            if (obj !== undefined)
                setSelCurricularYear({ id: urlParameters.get("year"), value: obj.value })
        }

        if (urlParameters.get("semester") !== null) {
            const obj = conf.semesters.find(item => item.id === urlParameters.get("semester"))
            if (obj !== undefined)
                setSelSemester({ id: urlParameters.get("semester"), value: obj.value })
        }

        if (urlParameters.get("unit") !== null) {
            const obj = conf.curricularUnits.find(item => item.id === urlParameters.get("unit"))
            if (obj !== undefined)
                setselCurricularUnit({ id: urlParameters.get("unit"), value: obj.value })
        }

        if (urlParameters.get("season") !== null) {
            const obj = conf.seasons.find(item => item.id === urlParameters.get("season"))
            if (obj !== undefined)
                setselSeason({ id: urlParameters.get("season"), value: obj.value })
        }
    }, [urlParameters])

    return (
        <div className="filter">
            <Container style={{ marginTop: 0 }}>
                <Row>
                    <Col xs="2">
                        <ul className="nav">
                            <li className="nav-item" style={cssLabels}>Ano:</li>
                            <li className="nav-item">
                                <UncontrolledDropdown setActiveFromChild style={{ float: "right" }}>
                                    <DropdownToggle tag="a" className="nav-link" caret>{selCurricularYear.value}</DropdownToggle>
                                    <DropdownMenu className="dropdown">
                                        <DropdownItem onClick={() => handleFilter("year", "", "Todos")} className="dropdown-item">Todos</DropdownItem>
                                        {conf.curricularYears.map(year => <DropdownItem key={year.id} onClick={() => handleFilter("year", year.id, year.value)}>{year.value}</DropdownItem>)}
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </li>
                        </ul>
                    </Col>
                    <Col xs="3">
                        <ul className="nav">
                            <li className="nav-item" style={cssLabels}>Semestre:</li>
                            <li className="nav-item">
                                <UncontrolledDropdown setActiveFromChild style={{ float: "right" }}>
                                    <DropdownToggle tag="a" className="nav-link" caret>{selSemester.value}</DropdownToggle>
                                    <DropdownMenu className="dropdown">
                                        <DropdownItem onClick={() => handleFilter("semester", "", "Todos")} className="dropdown-item">Todos</DropdownItem>
                                        {conf.semesters.map(semester => <DropdownItem key={semester.id} onClick={() => handleFilter("semester", semester.id, semester.value)}>{semester.value}</DropdownItem>)}
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </li>
                        </ul>
                    </Col>
                    <Col xs="4">
                        <ul className="nav">
                            <li className="nav-item" style={cssLabels}>Disciplina:</li>
                            <li className="nav-item">
                                <UncontrolledDropdown setActiveFromChild style={{ float: "right", maxWidth: 18 + "em" }}>
                                    <DropdownToggle tag="a" className="nav-link" caret>{selCurricularUnit.value}</DropdownToggle>
                                    <DropdownMenu className="dropdown">
                                        <DropdownItem onClick={() => handleFilter("unit", "", "Todas")} className="dropdown-item">Todas</DropdownItem>
                                        {conf.curricularUnits.map(unit => <DropdownItem key={unit.id} onClick={() => handleFilter("unit", unit.id, unit.value)}>{unit.value}</DropdownItem>)}
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </li>
                        </ul>
                    </Col>
                    <Col xs="3">
                        <ul className="nav">
                            <li className="nav-item" style={cssLabels}>Época:</li>
                            <li className="nav-item">
                                <UncontrolledDropdown setActiveFromChild style={{ float: "right" }}>
                                    <DropdownToggle tag="a" className="nav-link" caret>{selSeason.value}</DropdownToggle>
                                    <DropdownMenu className="dropdown">
                                        <DropdownItem onClick={() => handleFilter("season", "", "Todas")} className="dropdown-item">Todas</DropdownItem>
                                        {conf.seasons.map(season => <DropdownItem key={season.id} onClick={() => handleFilter("season", season.id, season.value)}>{season.value}</DropdownItem>)}
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