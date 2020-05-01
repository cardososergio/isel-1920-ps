import React from 'react'
import { Container, Row, Col, CardBody, CardDeck } from 'reactstrap'
import { Filter } from './Filter'
import PouchDB from 'pouchdb'
import PouchdbFind from 'pouchdb-find'
import "./Home.css"
import { connect } from "react-redux"

class Home extends React.Component {
    static displayName = Home.name;

    constructor(props) {
        super(props)

        PouchDB.plugin(PouchdbFind)

        this.state = {
            lstUnits: []
        }
    }

    componentDidMount() {
        this.searchDB()
    }

    componentDidUpdate(prevProps) {

        if (prevProps.filter.year.id !== this.props.filter.year.id || prevProps.filter.semester.id !== this.props.filter.semester.id ||
            prevProps.filter.unit.id !== this.props.filter.unit.id || prevProps.filter.season.id !== this.props.filter.season.id) {
            
            this.searchDB()
        }
    }

    searchDB() {

        const units = JSON.parse(localStorage.getItem("configuration")).curricularUnits
        const db = new PouchDB("http://127.0.0.1:5984/pees")

        let find = { user_id: JSON.parse(localStorage.getItem("user")).userId }
        if (this.props.filter.year.id !== "")
            find = { ...find, curricular_year: this.props.filter.year.id }
        if (this.props.filter.semester.id !== "")
            find = { ...find, semester: this.props.filter.semester.id }
        if (this.props.filter.unit.id !== "")
            find = { ...find, curricular_unit: this.props.filter.unit.id }
        if (this.props.filter.season.id !== "")
            find = { ...find, season: this.props.filter.season.id }
        
        db.find({ selector: find })
            .then((result) => {
                if (result.docs.length !== 0) {
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
                    lstUnits: Array.from([...new Set(docs.map(doc => doc.id))])
                        .map(id => { return { id: id, value: docs.find(doc => doc.id === id).value } })
                })
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Filter />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CardDeck style={{ display: 'flex', flexDirection: 'row' }}>
                            {
                                this.state.lstUnits.map(unit => {
                                    return (
                                        <div key={unit.id} className="card2">
                                            <CardBody>
                                                {unit.value}
                                            </CardBody>
                                        </div>
                                    )
                                })
                            }
                        </CardDeck>
                    </Col>
                </Row>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        filter: state.filter
    }
}

export default connect(mapStateToProps)(Home)