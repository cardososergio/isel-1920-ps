import React, { useState, useEffect } from "react"
import { CardBody, CardDeck, CardText } from 'reactstrap'
import PouchDB from 'pouchdb'
import PouchdbFind from 'pouchdb-find'
import * as Constants from "../Constants"
import { Link } from "react-router-dom"

export const UnitsCard = (props) => {
    const urlParameters = new URL(document.location.href).searchParams

    const [lstUnits, setLstUnits] = useState([])

    useEffect(() => {
        const units = JSON.parse(localStorage.getItem("configuration")).curricularUnits

        PouchDB.plugin(PouchdbFind)
        const db = new PouchDB(localStorage.getItem("isOffline") === "true" ? Constants.URL_COUCHDB_OFFLINE : Constants.URL_COUCHDB)

        let find = { user_id: JSON.parse(localStorage.getItem("user")).userId }
        if (urlParameters.get("year") !== null) find = { ...find, curricular_year: urlParameters.get("year") }
        if (urlParameters.get("semester") !== null) find = { ...find, semester: urlParameters.get("semester") }
        if (urlParameters.get("unit") !== null) find = { ...find, curricular_unit: urlParameters.get("unit") }
        if (urlParameters.get("season") !== null) find = { ...find, season: urlParameters.get("season") }

        db.find({ selector: find })
            .then((result) => {
                if (result.docs.length > 0) {
                    return result.docs.map(doc => {
                        const unit = units.find(unit => unit.id === doc.curricular_unit)

                        return { id: unit.id, value: unit.value }
                    })
                }
            })
            .then(docs => {
                if (docs === undefined) {
                    setLstUnits([])
                    return
                }

                setLstUnits(Array.from([...new Set(docs.map(doc => doc.id))]).map(id => { return { id: id, value: docs.find(doc => doc.id === id).value } }))
            })
            .catch(function (err) {
                console.log(err)
            })
    }, []);

    return (
        <CardDeck style={{ display: 'flex', flexDirection: 'row', justifyContent: "center" }}>
            {
                lstUnits.map(unit => {
                    const url = "/unit?" + urlParameters.toString() + (urlParameters.get("unit") === null ? "&unit=" + unit.id : "")

                    return (
                        <div key={unit.id} className="card2">
                            <Link to={url}>
                                <CardBody>
                                    <CardText>{unit.value}</CardText>
                                </CardBody>
                            </Link>
                        </div>
                    )
                })
            }
        </CardDeck>
    )
}