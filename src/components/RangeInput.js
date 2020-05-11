import React, { PureComponent } from 'react';
import './RangeInput.css';

/**
 * Range Input to control time
 */
class RangeInput extends PureComponent {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.ref.current.value = this.props.max;
    }

    render() {
        return (
            <input ref={this.ref} type="range" id="date" name="date" min="1" max={this.props.max} onChange={this.props.onChange} />
        )
    }
}

export default RangeInput;