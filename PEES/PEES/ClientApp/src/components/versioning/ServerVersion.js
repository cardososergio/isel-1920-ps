import React, { useEffect, useState } from "react"
import { Container, Row, Col } from "reactstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"

export const ServerVersion = (props) => {
    const [serverData, setServerData] = useState([])

    useEffect(() => {

        fetch('/api/versioncontrol/' + props.id + "?type=" + props.type).then(response => response.json())
            .then(data => {
                setServerData(data)
            })
    }, [props])

    const handleOnClick = (s) => (e) => {
        e.preventDefault()

        let localConfig = JSON.parse(localStorage.getItem("configuration"))


        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify("" + s.revision)
        }

        fetch('/api/versioncontrol/' + props.id + "?type=" + props.type, requestOptions)
            .then(response => {
                if (response.status === 200)
                    return response.json()

                alert("houve um problema ao gravar a alteração!")
            })
            .then(newRevision => {

                let auxType
                switch (props.type) {
                    case "curricularunit":
                        auxType = "curricularUnits"
                        break
                    case "curricularyear":
                        auxType = "curricularYears"
                        break
                    case "semester":
                        auxType = "semesters"
                        break
                    case "season":
                        auxType = "seasons"
                        break
                    case "instructiontype":
                        auxType = "instructionTypes"
                        break
                    default:
                }

                const update = localConfig[auxType].map(item => {
                    if (item.id === props.id)
                        return { ...item, value: s.value, revisionId: newRevision }
                    return item
                })

                localConfig[auxType] = update

                localStorage.setItem("configuration", JSON.stringify(localConfig))
                props.onUpdate()
            })
    }

    if (serverData.length === 0)
        return (<>A carregar...</>)

    return (
        <Container style={{ marginTop: 0 }}>
            {
                serverData.map((s, index) => {
                    return (
                        <Row key={index}>
                            <Col><Link to="#" onClick={handleOnClick(s)}>{s.value}</Link></Col>
                            <Col xs="1">{s.revision}</Col>
                            <Col>{formatDate(s.revisionDate)}</Col>
                            <Col xs="1">{s.isDeleted ? <FontAwesomeIcon icon={faTrash} /> : null}</Col>
                        </Row>
                    )
                })
            }
        </Container>
    )
}

const formatDate = (date) => {
    const d = new Date(date)
    let month = "" + (d.getMonth() + 1)
    let day = "" + d.getDate()
    let year = d.getFullYear()
    let hour = "" + d.getHours()
    let minutes = "" + d.getMinutes()
    let seconds = "" + d.getSeconds()

    if (month.length < 2) month = "0" + month
    if (day.length < 2) day = "0" + day
    if (hour.length < 2) hour = "0" + hour
    if (minutes.length < 2) minutes = "0" + minutes
    if (seconds.length < 2) seconds = "0" + seconds

    return [[year, month, day].join("-"), [hour, minutes, seconds].join(":")].join(" ");
}