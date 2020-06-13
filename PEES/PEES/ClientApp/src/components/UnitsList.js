import React, { useState, useEffect } from "react"
import { Table } from "reactstrap"
import PouchDB from 'pouchdb'
import PouchdbFind from 'pouchdb-find'
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faFile } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom"
import * as Constants from "../Constants"

export const UnitsList = (props) => {
    //const dispatch = useDispatch()
    const filter = useSelector(state => state.filter)

    const [list, setList] = useState([])

    useEffect(() => {
        const conf = JSON.parse(localStorage.getItem("configuration"))

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
                        let semester = conf.semesters.find(semester => semester.id === doc.semester)
                        let season = conf.seasons.find(season => season.id === doc.season)

                        semester = semester === undefined ? doc.semester : semester.value
                        season = season === undefined ? doc.season : season.value

                        return { id: doc._id, rev: doc._rev, semester: semester, season: season, name: doc.name, isDraft: doc.is_draft, isPublic: doc.is_public, grade: doc.grade }
                    })
                }
            })
            .then(docs => {
                if (docs === undefined) {
                    setList([])
                    return
                }
                
                setList(docs)
            })
            .catch(function (err) {
                console.log(err)
            })
    }, [filter.year.id, filter.semester.id, filter.unit.id, filter.season.id]);

    return (
        <Table hover>
            <thead>
                <tr>
                    <th>Semestre</th>
                    <th>Época</th>
                    <th>Nome</th>
                    <th className="text-center">Rascunho</th>
                    <th className="text-center">Público</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    list.map(item => {
                        return (
                            <tr key={item.id}>
                                <td>{item.semester}</td>
                                <td>{item.season}</td>
                                <td>{item.name}</td>
                                <td className="text-center"><FontAwesomeIcon icon={item.isDraft ? faCheck : faTimes} /></td>
                                <td className="text-center"><FontAwesomeIcon icon={item.isPublic ? faCheck : faTimes} /></td>
                                <td className="text-center"><Link to={`/document?id=${item.id}`}><FontAwesomeIcon icon={faFile} /></Link></td>
                            </tr>
                            )
                    })
                }
            </tbody>
        </Table>
    )
}
