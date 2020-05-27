import React, { useEffect, useState } from "react"
import { Container, Row, Col } from "reactstrap"
import { useSelector } from "react-redux"
import PouchDB from 'pouchdb'
import PouchdbFind from 'pouchdb-find'

export const Backoffice = (props) => {
    const [difCurricularUnits, setCurricularUnits] = useState([])

    const serverConfig = useSelector(state => state.backofficeData)

    useEffect(() => {
        const localConfig = JSON.parse(localStorage.getItem("configuration"))

        // compare Curricular units        
        const dif = localConfig.curricularUnits.filter(l => {
            return (serverConfig.curricularUnits.find(s => l.id === s.id) === undefined || serverConfig.curricularUnits.find(s => l.id === s.id && l.revisionId !== s.revisionId) !== undefined)
        })

        if (dif.length !== 0) {
            // check if the change is in use by pouchDB
            PouchDB.plugin(PouchdbFind)
            const db = new PouchDB("pees")

            const find = { user_id: JSON.parse(localStorage.getItem("user")).userId }

            db.find({ selector: find })
                .then((result) => {

                    let update = []

                    result.docs.forEach(doc => {
                        const r = dif.find(item => item.id === doc.curricular_unit)

                        if (r !== undefined) {
                            if (update.find(e => e.id === r.id) === undefined)
                                update.push(r)
                        }
                    })

                    setCurricularUnits(update)
                })
                .catch(function (err) {
                    console.log(err)
                })
        }
    }, [serverConfig])

    if (difCurricularUnits.length === 0)
        return(<></>)

    return (
        <Container>
            <Row>
                <Col className="text-center" style={{ marginBottom: 20 + "px" }}>
                    Existem registos que estão diferentes dos que estão no servidor
                </Col>
            </Row>
            <Row>
                <Col style={{ borderBottom: "1px solid lightgray" }}>
                    <b>Disciplinas</b>
                </Col>
            </Row>
            <Row>
                <Col>local</Col>
                <Col>servidor</Col>
            </Row>
            {
                difCurricularUnits.map(item => {
                    return (
                        <Row key={item.id}>
                            <Col>{item.value}</Col>
                            <Col></Col>
                        </Row>
                    )
                })
            }
        </Container>
    )
}