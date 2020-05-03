import React, { Component } from 'react';
import Chart from 'chart.js';

class LineChart extends Component {
    constructor(props) {
        super(props);

        this.chartRef = React.createRef();
    }

    updateData = () => {
        this.myChart.data.labels = this.props.data.map(e => e.label);
        this.myChart.data.datasets[0].data = this.props.data.map(e => e.value);
        this.myChart.data.datasets[0].fill = false;
        this.myChart.data.datasets[0].label = this.props.name;
        this.myChart.data.datasets[0].borderColor = this.props.color;

        if (this.props.annotation) {
            if (this.myChart.data.datasets.length > 1) {
                this.myChart.data.datasets[1].data = this.props.annotation.map(e => e.value);
                this.myChart.data.datasets[1].fill = false;
                this.myChart.data.datasets[1].label = "Capacité";
                this.myChart.data.datasets[1].borderColor = "#aaaaaa";
            } else {
                this.myChart.data.datasets.push({
                    fill: false,
                    data: this.props.annotation.map(e => e.value),
                    label: "Capacité",
                    borderColor: "#aaaaaa",
                });
            }

        }

        this.myChart.update();
    }

    componentDidMount() {
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
        this.updateData();
    }

    render() {
        return (
            <div>
                <canvas ref={this.chartRef}></canvas>
            </div>

        )
    }
}

export default LineChart;