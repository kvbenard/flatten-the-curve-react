import React, { PureComponent } from 'react';

import FilteredElement from '../components/FilteredElement';

import './filteredElements.css';

class FilteredElements extends PureComponent {


    render() {
        return (
            <div className="filteredElements">
                {this.props.elements.length > 0 ?
                    this.props.elements.map(e => <FilteredElement key={e} element={e} onClick={this.props.onElementDeleted} />) :
                    <p>Cliquez sur un département pour le séléctionner</p>}
            </div>
        )
    }
}

export default FilteredElements;