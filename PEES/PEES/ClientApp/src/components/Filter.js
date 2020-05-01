import React, { useState, useEffect } from "react"
import { Container, Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"
import { useDispatch } from "react-redux"
import "./Filter.css"

export const Filter = (props) => {
    const dispatch = useDispatch()
    const conf = JSON.parse(localStorage.getItem("configuration"))

    const [selCurricularYear, setSelCurricularYear] = useState({ id: "", value: "Todos" })
    const [selSemester, setSelSemester] = useState({ id: "", value: "Todos" })
    const [selSeason, setselSeason] = useState({ id: "", value: "Todas" })
    const [selCurricularUnit, setselCurricularUnit] = useState({ id: "", value: "Todas" })

    const cssLabels = { lineHeight: 37 + "px" }

    useEffect(() => {
        dispatch({ type: "FILTER", payload: { year: selCurricularYear, semester: selSemester, unit: selCurricularUnit, season: selSeason } })
    }, [selCurricularYear, selSemester, selCurricularUnit, selSeason, dispatch]);

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
                                        <DropdownItem onClick={() => setSelCurricularYear({ id: "", value: "Todos" })} className="dropdown-item">Todos</DropdownItem>
                                        {conf.curricularYears.map(year => <DropdownItem key={year.id} onClick={() => setSelCurricularYear({ id: year.id, value: year.value })}>{year.value}</DropdownItem>)}
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
                                        <DropdownItem onClick={() => setSelSemester({ id: "", value: "Todos" })} className="dropdown-item">Todos</DropdownItem>
                                        {conf.semesters.map(semester => <DropdownItem key={semester.id} onClick={() => setSelSemester({ id: semester.id, value: semester.value })}>{semester.value}</DropdownItem>)}
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
                                        <DropdownItem onClick={() => setselCurricularUnit({ id: "", value: "Todas" })} className="dropdown-item">Todas</DropdownItem>
                                        {conf.curricularUnits.map(unit => <DropdownItem key={unit.id} onClick={() => setselCurricularUnit({ id: unit.id, value: unit.value })}>{unit.value}</DropdownItem>)}
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
                                        <DropdownItem onClick={() => setselSeason({ id: "", value: "Todas" })} className="dropdown-item">Todas</DropdownItem>
                                        {conf.seasons.map(season => <DropdownItem key={season.id} onClick={() => setselSeason({ id: season.id, value: season.value })}>{season.value}</DropdownItem>)}
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