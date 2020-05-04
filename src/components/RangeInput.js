import React, { Component } from 'react';
import './RangeInput.css';

class RangeInput extends Component {
    render() {
        return (
            <input type="range" id="vol" name="vol" min="1" max={this.props.max} onChange={this.props.onChange} />
        )
    }
}

export default RangeInput;