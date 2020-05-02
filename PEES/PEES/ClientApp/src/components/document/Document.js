import React from "react"
import { connect } from "react-redux"
import { Container, Row, Col } from "reactstrap"

class Document extends React.Component {

    render() {
        return (
            <>
                <Container>
                    <Row>
                        <Col>
                            <h1>Enunciado</h1>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}
export default connect()(Document)