import React, { Component } from 'react';
import Chart from 'chart.js';
import 'chartjs-plugin-annotation';

/**
 * Uses the Chart.js library to show a line chart
 */
class LineChart extends Component {
    constructor(props) {
        super(props);

        this.chartRef = React.createRef();

        this.isAlternative = false;
    }

    updateData = () => {
        let data = this.groupDatasetByDate(this.props.measure).map(d => {
            return {
                label: d.date,
                value: d[this.props.measure]
            }
        });

        this.myChart.data.labels = data.map(e => e.label);
        this.myChart.data.datasets[0].data = data.map(e => e.value);
        this.myChart.data.datasets[0].fill = false;
        this.myChart.data.datasets[0].label = this.props.name;
        this.myChart.data.datasets[0].borderColor = this.props.color;

        if (this.props.annotation) {
            let annotation = this.groupDatasetByDate(this.props.annotation);
            if (this.myChart.data.datasets.length > 1) {
                this.myChart.data.datasets[1].data = annotation.map(e => e[this.props.annotation]);
                this.myChart.data.datasets[1].fill = false;
                this.myChart.data.datasets[1].label = "Capacité";
                this.myChart.data.datasets[1].borderColor = "#aaaaaa";
            } else {
                this.myChart.data.datasets.push({
                    fill: false,
                    data: annotation.map(e => e[this.props.annotation]),
                    label: "Capacité",
                    borderColor: "#aaaaaa",
                });
            }

        }

        this.myChart.options.annotation.annotations[0].value = this.props.date;

        this.myChart.update();
    }

    groupDatasetByDate = (measure) => {
        let groupedDataset = {};
        this.props.data
            .filter(e => this.props.departments.length > 0 ? this.props.departments.includes(e.department) : true)
            .forEach(elem => {
                let date = elem.date;
                if (Object.keys(groupedDataset).includes(date)) {
                    groupedDataset[date][measure] = parseInt(elem[measure]) + parseInt(groupedDataset[date][measure]);
                } else {
                    groupedDataset[date] = {
                        date: date
                    }
                    groupedDataset[date][measure] = parseInt(elem[measure])
                }
            });

        return Object.values(groupedDataset);
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
                responsive: true,
                annotation: {
                    annotations: [
                        {
                            drawTime: "afterDatasetsDraw",
                            type: "line",
                            mode: "vertical",
                            scaleID: "x-axis-0",
                            value: "2020-04-20",
                            borderColor: "black",
                            borderWidth: 1
                        }
                    ]
                }
            }
        });
        this.updateData(this.props.data);
    }

    componentDidUpdate() {
        this.updateData(this.props.data);
    }

    switchData = () => {
        this.isAlternative ? this.updateData(this.props.data) : this.updateData(this.props.alternativeData);
        this.isAlternative = !this.isAlternative;
    }

    render() {
        let button;
        if (this.props.alternativeData) {
            button = <button onClick={this.switchData}>Switch</button>
        }

        return (
            <div>
                <canvas ref={this.chartRef}></canvas>
                {button}
            </div>

        )
    }
}

export default LineChart;