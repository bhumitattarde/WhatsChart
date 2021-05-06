import React from "react"
import PropTypes from "prop-types"

class Chart extends React.Component {

    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
        // this.state = {}
    }

    render() {
        return (
            <div>
                <h1>{this.props.author1.periodInDays} days of WhatsApp texting</h1>
                <h2>between {this.props.author1.name} &amp; {this.props.author2.name} in numbers</h2>
            </div>
        );
    }
}

Chart.propTypes = {

    author1: PropTypes.object.isRequired,
    author2: PropTypes.object.isRequired,
}

Chart.defaultProps = {
    author1: {},
    author2: {},
}

export default Chart;