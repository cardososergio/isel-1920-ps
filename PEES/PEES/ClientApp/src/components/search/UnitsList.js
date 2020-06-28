import React from "react"
import { connect } from "react-redux"
import { Table } from "reactstrap"
import PouchDB from 'pouchdb'
import PouchdbFind from 'pouchdb-find'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faFile } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom"
import * as Constants from "../global/Constants"

class UnitsList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            list: []
        }
    }

    componentDidMount() {
        const conf = JSON.parse(localStorage.getItem("configuration"))
        const parameters = new URL(document.location.href).searchParams

        PouchDB.plugin(PouchdbFind)
        const db = new PouchDB(localStorage.getItem("isOffline") === "true" ? Constants.URL_COUCHDB_OFFLINE : Constants.URL_COUCHDB)

        let find
        if (this.props.viewOnly)
            find = { is_public: true }
        else
            find = { user_id: JSON.parse(localStorage.getItem("user")).userId }

        if (this.props.filter.year.id !== "") find = { ...find, curricular_year: this.props.filter.year.id }
        if (this.props.filter.semester.id !== "") find = { ...find, semester: this.props.filter.semester.id }
        if (this.props.filter.season.id !== "") find = { ...find, season: this.props.filter.season.id }
        if (parameters.get("unit") !== null)
            find = { ...find, curricular_unit: parameters.get("unit") }
        else
            find = { ...find, curricular_unit: "#" } // invalid

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
                    this.setState({ list: [] })
                    return
                }

                this.setState({ list: docs })
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    render() {

        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Semestre</th>
                        <th>Época</th>
                        <th>Nome</th>
                        {!this.props.viewOnly ?
                            <>
                                <th className="text-center">Rascunho</th>
                                <th className="text-center">Público</th>
                            </>
                            :
                            null
                        }

                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.list.map(item => {
                            return (
                                <tr key={item.id}>
                                    <td>{item.semester}</td>
                                    <td>{item.season}</td>
                                    <td>{item.name}</td>
                                    {!this.props.viewOnly ?
                                        <>
                                            <td className="text-center"><FontAwesomeIcon icon={item.isDraft ? faCheck : faTimes} /></td>
                                            <td className="text-center"><FontAwesomeIcon icon={item.isPublic ? faCheck : faTimes} /></td>
                                        </>
                                        :
                                        null
                                    }
                                    <td className="text-center">
                                        {!this.props.viewOnly ?
                                            <Link to={`/document?id=${item.id}`}><FontAwesomeIcon icon={faFile} /></Link>
                                            :
                                            <Link to={`/view/document?id=${item.id}`}><FontAwesomeIcon icon={faFile} /></Link>
                                        }

                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        )
    }
}
function mapStateToProps(state) {
    return {
        filter: state.filter,
        viewOnly: state.viewOnly
    }
}

export default connect(mapStateToProps)(UnitsList)