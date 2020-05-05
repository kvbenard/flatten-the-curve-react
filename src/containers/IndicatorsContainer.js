import React, { Component } from 'react';
import Indicator from '../components/Indicator';
import './IndicatorsContainer.css';

class IndicatorsContainer extends Component {
    computeIndicators = () => {
        let data = this.props.departments.length === 0 ? this.props.data : this.props.data.filter(e => this.props.departments.includes(e.department));
        return [
            {
                name: 'Hospitalisations',
                color: '#3e95cd',
                value: data.reduce((acc, v) => parseInt(acc) + parseInt(v.hospitalizations), 0)
            },
            {
                name: 'Réanimations',
                color: '#c45850',
                value: data.reduce((acc, v) => parseInt(acc) + parseInt(v.reanimations), 0)
            },
            {
                name: 'Retours à domicile',
                color: '#8e5ea2',
                value: data.reduce((acc, v) => parseInt(acc) + parseInt(v.returnHome), 0)
            },
            {
                name: 'Décès',
                color: '#3cba9f',
                value: data.reduce((acc, v) => parseInt(acc) + parseInt(v.deaths), 0)
            }
        ]
    }

    render() {
        let indicators = this.computeIndicators();
        return (
            <div className="indicators_container">
                <Indicator indicator={indicators[0]} />
                <Indicator indicator={indicators[1]} />
                <Indicator indicator={indicators[2]} />
                <Indicator indicator={indicators[3]} />
            </div>
        )
    }
}

export default IndicatorsContainer;