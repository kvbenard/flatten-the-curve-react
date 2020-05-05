import React, { Component } from 'react';
import Map from '../components/Map';
import RangeInput from '../components/RangeInput';
import IndicatorsContainer from './IndicatorsContainer';

import moment from 'moment/moment.js';

class MapContainer extends Component {
    constructor(props) {
        super(props);

        let dates = [];
        props.data.forEach(elem => {
            if (!dates.includes(elem.date)) {
                dates.push(elem.date);
            }
        });

        this.datesSize = dates.length;

        this.maxDate = dates.sort((a, b) => new Date(b) - new Date(a))[0];

        this.state = {
            currentDate: moment(this.maxDate),
            currentData: this.filterData(moment(this.maxDate))
        }
    }

    filterData = (date) => {
        return this.props.data.filter(line => {
            return date.isSame(line.date) && line.department < 900;
        });
    }

    onChangeHandler = (event) => {
        let numberOfDaysToAdd = this.datesSize - event.target.value;

        let newDate = moment(this.maxDate).subtract(numberOfDaysToAdd, 'days');

        this.setState({
            currentData: this.filterData(newDate),
            currentDate: newDate,
        });
    }

    render() {

        return (
            <div>
                <Map data={this.state.currentData} onDepartmentClick={this.props.onDepartmentClick} />
                <RangeInput onChange={this.onChangeHandler} max={this.datesSize} />
                <div className="currentDate">{this.state.currentDate.format('DD/MM/YYYY')}</div>
                <IndicatorsContainer data={this.state.currentData} departments={this.props.departments} />
            </div>
        )
    }
}

export default MapContainer;