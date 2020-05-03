import React, { Component } from 'react';
import LineChart from '../components/LineChart';
import Map from '../components/Map';
import './Dashboard.css';
import { department_data } from '../data/department_data';

class Dashboard extends Component {
    constructor() {
        super();

        this.state = {
            dataset: [],
            datasetGroupedByDate: [],
            datasetGroupedByDepartment: [],
            departments: []
        }
    }

    constructDataset = (text) => {
        let dataset = csvJSON(text).filter(e => (e.sexe === "0" && e.dep < 900)).map(elem => {
            let depData = department_data.filter(e => e.department === elem.dep)[0];
            return {
                "date": elem.jour,
                "department": elem.dep,
                "hospitalizations": elem.hosp,
                "deaths": elem.dc,
                "returnHome": elem.rad,
                "reanimations": elem.rea,
                "population": depData ? depData.population : 1,
                "reanimation_capacity": depData ? depData.reanimation_capacity : 1,
            }
        });

        return dataset;
    }

    groupDatasetByDate = (dataset) => {
        let groupedDataset = {};
        dataset.forEach(elem => {
            let date = elem.date;
            if (Object.keys(groupedDataset).includes(date)) {
                groupedDataset[date].reanimations = parseInt(elem.reanimations) + parseInt(groupedDataset[date].reanimations);
                groupedDataset[date].returnHome = parseInt(elem.returnHome) + parseInt(groupedDataset[date].returnHome);
                groupedDataset[date].deaths = parseInt(elem.deaths) + parseInt(groupedDataset[date].deaths);
                groupedDataset[date].hospitalizations = parseInt(elem.hospitalizations) + parseInt(groupedDataset[date].hospitalizations);
                groupedDataset[date].population = parseInt(elem.population) + parseInt(groupedDataset[date].population);
                groupedDataset[date].reanimation_capacity = parseInt(elem.reanimation_capacity) + parseInt(groupedDataset[date].reanimation_capacity);
            } else {
                groupedDataset[date] = {
                    date: date,
                    reanimations: elem.reanimations,
                    returnHome: elem.returnHome,
                    deaths: elem.deaths,
                    hospitalizations: elem.hospitalizations,
                    population: elem.population,
                    reanimation_capacity: elem.reanimation_capacity,
                }
            }
        });

        return Object.values(groupedDataset);
    }

    groupDatasetByDepartment = (dataset) => {
        let groupedDataset = {};

        dataset.filter(e => e.date === '2020-04-01').forEach(elem => {
            let department = elem.department;
            if (Object.keys(groupedDataset).includes(department)) {
                groupedDataset[department].reanimations = parseInt(elem.reanimations) + parseInt(groupedDataset[department].reanimations);
                groupedDataset[department].returnHome = parseInt(elem.returnHome) + parseInt(groupedDataset[department].returnHome);
                groupedDataset[department].deaths = parseInt(elem.deaths) + parseInt(groupedDataset[department].deaths);
                groupedDataset[department].hospitalizations = parseInt(elem.hospitalizations) + parseInt(groupedDataset[department].hospitalizations);
            } else {
                groupedDataset[department] = {
                    department: department,
                    reanimations: elem.reanimations,
                    returnHome: elem.returnHome,
                    deaths: elem.deaths,
                    hospitalizations: elem.hospitalizations,
                    population: elem.population,
                    reanimation_capacity: elem.reanimation_capacity,
                }
            }
        });


        for (let elem in groupedDataset) {
            groupedDataset[elem].reanimations = groupedDataset[elem].reanimations / groupedDataset[elem].reanimation_capacity;
            groupedDataset[elem].returnHome = groupedDataset[elem].returnHome / groupedDataset[elem].population;
            groupedDataset[elem].deaths = groupedDataset[elem].deaths / groupedDataset[elem].population;
            groupedDataset[elem].hospitalizations = groupedDataset[elem].hospitalizations / groupedDataset[elem].reanimation_capacity;
        }

        return Object.values(groupedDataset);
    }

    componentDidMount() {

        fetch('https://www.data.gouv.fr/fr/datasets/r/63352e38-d353-4b54-bfd1-f1b3ee1cabd7')
            .then(response => response.text())
            .then(text => {
                let dataset = this.constructDataset(text);

                let datasetGroupedByDate = this.groupDatasetByDate(dataset);

                let datasetGroupedByDepartment = this.groupDatasetByDepartment(dataset).map(e => {
                    return {
                        id: "FR-" + e.department,
                        value: e.reanimations,
                        department: e.department
                    }
                });

                this.setState({
                    dataset: dataset,
                    datasetGroupedByDate: datasetGroupedByDate,
                    datasetGroupedByDepartment: datasetGroupedByDepartment
                });
            });
    }

    departmentClicked = (department) => {
        let departmentsCopy = this.state.departments.slice();

        var index = departmentsCopy.indexOf(department);
        if (index === -1) {
            departmentsCopy.push(department);
        } else {
            departmentsCopy.splice(index, 1);
        }

        this.setState({
            departments: departmentsCopy,
            datasetGroupedByDate: departmentsCopy.length === 0 ? this.groupDatasetByDate(this.state.dataset) : this.groupDatasetByDate(this.state.dataset.filter(e => departmentsCopy.includes(e.department)))
        })
    }


    render() {
        return (
            !this.state.datasetGroupedByDepartment.length ?
                <h1>Loading</h1> :
                <div className="dashboard">
                    <Map data={this.state.datasetGroupedByDepartment} onDepartmentClick={this.departmentClicked} />
                    <div className="chartsContainer">
                        <LineChart
                            data={this.state.datasetGroupedByDate.map(d => {
                                return {
                                    label: d.date,
                                    value: d.hospitalizations
                                }
                            })}
                            name="Hospitalisations"
                            color="#3e95cd"
                        />

                        <LineChart
                            data={this.state.datasetGroupedByDate.map(d => {
                                return {
                                    label: d.date,
                                    value: d.reanimations
                                }
                            })}
                            name="Reanimations"
                            annotation={this.state.datasetGroupedByDate.map(d => {
                                return {
                                    label: d.date,
                                    value: d.reanimation_capacity
                                }
                            })}
                            color="#c45850" />

                        <LineChart
                            data={this.state.datasetGroupedByDate.map(d => {
                                return {
                                    label: d.date,
                                    value: d.returnHome
                                }
                            })}
                            name="Retours à domicile"
                            color="#8e5ea2" />

                        <LineChart
                            data={this.state.datasetGroupedByDate.map(d => {
                                return {
                                    label: d.date,
                                    value: d.deaths
                                }
                            })}
                            name="Décès"
                            color="#3cba9f" />
                    </div>
                </div>
        )
    }
}

function csvJSON(csv) {
    const lines = csv.replace(/"/g, '').split('\n')
    const result = []
    const headers = lines[0].replace(/\s/g, '').replace(/"/g, '').split(';');

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i])
            continue
        const obj = {}
        const currentline = lines[i].split(';')

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j]
        }
        result.push(obj)
    }
    return result
}

export default Dashboard;