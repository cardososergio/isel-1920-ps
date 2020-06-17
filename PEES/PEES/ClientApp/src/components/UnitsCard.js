import React, { useState, useEffect } from "react"
import { CardBody, CardDeck, CardText } from 'reactstrap'
import PouchDB from 'pouchdb'
import PouchdbFind from 'pouchdb-find'
import { useSelector, useDispatch } from "react-redux"
import * as Constants from "../Constants"

export const UnitsCard = (props) => {
    const dispatch = useDispatch()
    const filter = useSelector(state => state.filter)

    const [lstUnits, setLstUnits] = useState([])

    useEffect(() => {
        const units = JSON.parse(localStorage.getItem("configuration")).curricularUnits

        PouchDB.plugin(PouchdbFind)
        const db = new PouchDB(Constants.URL_COUCHDB)

        let find = { user_id: JSON.parse(localStorage.getItem("user")).userId }
        if (filter.year.id !== "") find = { ...find, curricular_year: filter.year.id }
        if (filter.semester.id !== "") find = { ...find, semester: filter.semester.id }
        if (filter.unit.id !== "") find = { ...find, curricular_unit: filter.unit.id }
        if (filter.season.id !== "") find = { ...find, season: filter.season.id }

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
    }, [filter.year.id, filter.semester.id, filter.unit.id, filter.season.id]);

    return (
        <CardDeck style={{ display: 'flex', flexDirection: 'row', justifyContent: "center" }}>
            {
                lstUnits.map(unit => {
                    return (
                        <div key={unit.id} className="card2">
                            <CardBody onClick={() => {
                                dispatch({ type: "UNIT_ID", payload: unit.id })
                                dispatch({ type: "FILTER_UNIT", payload: { id: unit.id, value: unit.value } })
                                dispatch({ type: "UNITS_VIEW", payload: "list" })
                            }
                            }>
                                <CardText>{unit.value}</CardText>
                            </CardBody>
                        </div>
                    )
                })
            }
        </CardDeck>
    )
}