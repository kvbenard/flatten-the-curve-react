import React, { Component } from 'react';
import './Indicator.css';

class Indicator extends Component {
    render() {
        return (
            <div style={{ backgroundColor: this.props.indicator.color }} className="indicator">
                <h3>{this.props.indicator.name}</h3>
                <div>{this.props.indicator.value} ({this.props.indicator.altValue})</div>
            </div>
        )
    }
}

export default Indicator;

