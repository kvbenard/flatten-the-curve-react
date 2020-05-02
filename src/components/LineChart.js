import React, { Component } from 'react';
import Chart from 'chart.js';
import moment from 'moment';

class LineChart extends Component {
    constructor(props) {
        super(props);
        console.log("Line Constructed");

        this.chartRef = React.createRef();
    }

    updateData = () => {
        this.myChart.data.labels = this.props.data.map(e => e.label);
        this.myChart.data.datasets[0].data = this.props.data.map(e => e.value);
        this.myChart.data.datasets[0].fill = false;
        this.myChart.data.datasets[0].label = this.props.name;
        this.myChart.data.datasets[0].borderColor = this.props.color;
        this.myChart.update();
    }

    componentDidMount() {
        console.log("Line Mounted");
        this.myChart = new Chart(this.chartRef.current, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                }]
            },
            options: {
                responsive: true
            }
        });
        this.updateData();
    }

    componentDidUpdate() {
        console.log("Line Updated");
        this.updateData();
    }

    render() {
        console.log("Line Rendered");
        console.log(this.props.data);
        return (
            <div>
                <canvas ref={this.chartRef}></canvas>
            </div>

        )
    }
}

export default LineChart;