import React, { PureComponent } from 'react';
import './Indicator.css';

/**
 * Simple indicator
 * Shows teh measure's name and its value
 */
class Indicator extends PureComponent {

    /**
     * Get the requested value from the dataset
     */
    getValue = () => {
        return this.props.data
            .filter(e => this.props.departments.length > 0 ? (this.props.departments.includes(e.department) && this.props.date === e.date) : this.props.date === e.date)
            .reduce((acc, v) => parseInt(v[this.props.measure]) + acc, 0);
    }

    render() {
        return (
            <div style={{ backgroundColor: this.props.color }} className="indicator">
                <div className="indicatorsContent">
                    <h3 className="title">{this.props.name}</h3>
                    <div className="value">{this.getValue()}</div>
                </div>
            </div>
        )
    }
}

export default Indicator;

