import React, { PureComponent } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import './FilteredElement.css';

/**
 * An element of a list of filtered elements
 */
class FilteredElement extends PureComponent {

    onElementClicked = (e) => {
        this.props.onClick(this.props.element);
    }

    render() {
        return (
            <div className="filteredElement">
                {this.props.element}
                <button onClick={this.onElementClicked}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
        )
    }
}

export default FilteredElement;