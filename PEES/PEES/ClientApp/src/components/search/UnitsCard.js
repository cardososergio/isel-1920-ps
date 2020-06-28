import React from "react"
import { connect } from "react-redux"
import { CardBody, CardDeck, CardText } from 'reactstrap'
import PouchDB from 'pouchdb'
import PouchdbFind from 'pouchdb-find'
import * as Constants from "../global/Constants"
import { Link } from "react-router-dom"

class UnitsCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            lstUnits: [],
            urlParams: new URL(document.location.href).searchParams
        }

        this.getData = this.getData.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.filter !== this.props.filter) {
            this.getData()
        }
    }

    getData() {
        const units = JSON.parse(localStorage.getItem("configuration")).curricularUnits

        PouchDB.plugin(PouchdbFind)
        const db = new PouchDB(localStorage.getItem("isOffline") === "true" ? Constants.URL_COUCHDB_OFFLINE : Constants.URL_COUCHDB)

        let find = { user_id: JSON.parse(localStorage.getItem("user")).userId }
        if (this.props.filter["year"].id !== "") find = { ...find, curricular_year: this.props.filter["year"].id }
        if (this.props.filter["semester"].id !== "") find = { ...find, semester: this.props.filter["semester"].id }
        if (this.props.filter["unit"].id !== "") find = { ...find, curricular_unit: this.props.filter["unit"].id }
        if (this.props.filter["season"].id !== "") find = { ...find, season: this.props.filter["season"].id }

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
                    this.setState({ lstUnits: [] })
                    return
                }

                this.setState({
                    lstUnits: Array.from([...new Set(docs.map(doc => doc.id))]).map(id => { return { id: id, value: docs.find(doc => doc.id === id).value } }),
                    urlParams: new URL(document.location.href).searchParams
                })
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    render() {
        return (
            <CardDeck style={{ display: 'flex', flexDirection: 'row', justifyContent: "center" }}>
                {
                    this.state.lstUnits.map(unit => {
                        const url = "/unit?" + this.state.urlParams.toString() + (this.state.urlParams.get("unit") === null ? (this.state.urlParams.toString() === "" ? "": "&") + "unit=" + unit.id : "")

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
}
function mapStateToProps(state) {
    return {
        filter: state.filter
    }
}

export default connect(mapStateToProps)(UnitsCard)