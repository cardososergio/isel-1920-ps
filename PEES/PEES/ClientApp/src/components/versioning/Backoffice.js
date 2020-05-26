import React, { useEffect } from "react"
import { Container, Row, Col } from "reactstrap"
import { useSelector } from "react-redux"
import PouchDB from 'pouchdb'
import PouchdbFind from 'pouchdb-find'

export const Backoffice = (props) => {
    const backofficeData = useSelector(state => state.backofficeData)

    useEffect(() => {

        // compare Curricular units
        const localConfig = JSON.parse(localStorage.getItem("configuration"))
        const serverConfig = backofficeData

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

                    return result.docs.forEach(doc => {
                        const r = dif.find(item => item.id === doc.curricular_unit)
                        if (r !== undefined) {
                            console.log(r)
                        }
                    })
                })
                .catch(function (err) {
                    console.log(err)
                })
        }

    }, [backofficeData])

    return (
        <Container>
            <Row>
                <Col>
                    Version Control
                </Col>
            </Row>
        </Container>
    )
}