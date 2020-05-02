import React, { Component } from 'react';
import LineChart from '../components/LineChart';
import Map from '../components/Map';
import './Dashboard.css';

class Dashboard extends Component {
    constructor() {
        super();
        console.log("Dashboard Constructed");
        this.state = {
            globalDataSet: [],
            specificDataset: [],
            departmentsDataset: [],
            departments: []
        }
    }

    constructSpecificDataset = (globalDS) => {
        console.log("Specific Dataset Constructed");
        let specificDS = {};
        globalDS.forEach(elem => {
            let date = elem.jour;
            if (Object.keys(specificDS).includes(date)) {
                specificDS[date].reanimations = parseInt(elem.rea) + parseInt(specificDS[date].reanimations);
                specificDS[date].returnHome = parseInt(elem.rad) + parseInt(specificDS[date].returnHome);
                specificDS[date].deaths = parseInt(elem.dc) + parseInt(specificDS[date].deaths);
                specificDS[date].hospitalizations = parseInt(elem.hosp) + parseInt(specificDS[date].hospitalizations);

            } else {
                specificDS[date] = {
                    date: date,
                    reanimations: elem.rea,
                    returnHome: elem.rad,
                    deaths: elem.dc,
                    hospitalizations: elem.hosp
                }
            }
        });

        return Object.values(specificDS);
    }

    componentDidMount() {

        console.log("Dashboard Mounted");
        let globalDS = [];
        fetch('https://www.data.gouv.fr/fr/datasets/r/63352e38-d353-4b54-bfd1-f1b3ee1cabd7')
            .then(response => response.text())
            .then(text => {
                globalDS = csvJSON(text).filter(e => e.sexe === "0");

                let specificDS = this.constructSpecificDataset(globalDS);

                let departmentsDS = globalDS.filter(e => e.jour === '2020-04-01').map(e => {
                    return {
                        id: "FR-" + e.dep,
                        value: e.rea,
                        department: e.dep
                    }
                });

                this.setState({
                    specificDataset: specificDS,
                    globalDataSet: globalDS,
                    departmentsDataset: departmentsDS
                });
            });
    }

    departmentClicked = (department) => {
        console.log("Department Click Handler");
        let departmentsCopy = this.state.departments.slice();

        var index = departmentsCopy.indexOf(department);
        if (index == -1) {
            departmentsCopy.push(department);
        } else {
            departmentsCopy.splice(index, 1);
        }

        console.log(this.state.globalDataSet);

        this.setState({
            departments: departmentsCopy,
            specificDataset: departmentsCopy.length === 0 ? this.constructSpecificDataset(this.state.globalDataSet) : this.constructSpecificDataset(this.state.globalDataSet.filter(e => departmentsCopy.includes(e.dep)))
        })
    }


    render() {
        console.log("Dashboard Rendered");
        return (
            !this.state.departmentsDataset.length ?
                <h1>Loading</h1> :
                <div className="dashboard">
                    <Map data={this.state.departmentsDataset} onDepartmentClick={this.departmentClicked} />
                    <div className="chartsContainer">
                        <LineChart
                            data={this.state.specificDataset.map(d => {
                                return {
                                    label: d.date,
                                    value: d.hospitalizations
                                }
                            })}
                            name="Hospitalisations"
                            color="#c45850" />

                        <LineChart
                            data={this.state.specificDataset.map(d => {
                                return {
                                    label: d.date,
                                    value: d.reanimations
                                }
                            })}
                            name="Reanimations"
                            color="#3e95cd" />

                        <LineChart
                            data={this.state.specificDataset.map(d => {
                                return {
                                    label: d.date,
                                    value: d.returnHome
                                }
                            })}
                            name="Retours à domicile"
                            color="#8e5ea2" />

                        <LineChart
                            data={this.state.specificDataset.map(d => {
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