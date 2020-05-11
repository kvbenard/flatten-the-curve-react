import React, { Component, Fragment } from 'react';

import LineChart from '../components/LineChart';
import Map from '../components/Map';
import RangeInput from '../components/RangeInput';
import Indicator from '../components/Indicator';

import FilteredElements from '../containers/FilteredElements';

import Popup from "reactjs-popup";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'

import './Dashboard.css';
import { department_data } from '../data/department_data';

import moment from 'moment/moment.js';

/**
 * Dashboard component is the container of all the different charts
 */
class Dashboard extends Component {
    constructor() {
        super();

        this.colors = {
            "hospitalizations": "#3e95cd",
            "deaths": "#8e5ea2",
            "returnHome": "#3cba9f",
            "reanimations": "#c45850"
        }

        /* dataset is the globa dataset used in different charts and map
        departments contains the current filtered departments  */
        this.state = {
            dataset: [],
            departments: []
        }
    }

    /** When the component did mount, get the csv file containing the data and construct the dataset */
    componentDidMount() {

        fetch('https://www.data.gouv.fr/fr/datasets/r/63352e38-d353-4b54-bfd1-f1b3ee1cabd7')
            .then(response => response.text())
            .then(text => {
                let dataset = this.constructDataset(text);

                let dates = [];
                dataset.forEach(elem => {
                    if (!dates.includes(elem.date)) {
                        dates.push(elem.date);
                    }
                });

                let datesSize = dates.length;

                let maxDate = dates.sort((a, b) => new Date(b) - new Date(a))[0];
                this.setState({
                    dataset: dataset,
                    currentDate: moment(maxDate),
                    maxDate: maxDate,
                    datesSize: datesSize
                });
            });
    }

    /**
     * construct dataset from the text string containing data in CSV format
     */
    constructDataset = (text) => {
        let dataset = this.csvJSON(text).filter(e => (e.sexe === "0")).map(elem => {
            let depData = department_data.filter(e => e.department === elem.dep)[0];
            return {
                "date": elem.jour,
                "department": elem.dep,
                "hospitalizations": elem.hosp,
                "deaths": elem.dc,
                "returnHome": elem.rad,
                "reanimations": elem.rea,
                "population": depData ? depData.population : 0,
                "reanimation_capacity": depData ? depData.reanimation_capacity : 0,
            }
        });

        /* Construct the variation variables (newDeaths and newReturnHome)  */
        dataset.forEach(elem => {
            let previousDay = moment(elem.date).subtract(1, 'day').format('YYYY-MM-DD');
            let previousDayObj = dataset.filter(e => {
                return (e.department === elem.department && e.date === previousDay)
            })[0];
            elem.newDeaths = previousDayObj ? elem.deaths - previousDayObj.deaths : elem.deaths;
            elem.newReturnHome = previousDayObj ? elem.returnHome - previousDayObj.returnHome : elem.returnHome;
        })

        return dataset;
    }

    /**
     * construct a JSON object from a CSV string
     */
    csvJSON = (csv) => {
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

    /** Called when the slider's value changes */
    onChangeHandler = (event) => {
        let numberOfDaysToAdd = this.state.datesSize - event.target.value;

        let newDate = moment(this.state.maxDate).subtract(numberOfDaysToAdd, 'days');

        this.setState({
            currentDate: newDate,
        });
    }

    /** 
     * Called when a department is clicked
     * Add or remove it of the departments array
     */
    onDepartmentClicked = (department) => {
        let departmentsCopy = this.state.departments.slice();

        var index = departmentsCopy.indexOf(department);
        if (index === -1) {
            departmentsCopy.push(department);
        } else {
            departmentsCopy.splice(index, 1);
        }

        this.setState({
            departments: departmentsCopy,
        })
    }

    render() {
        return (
            !this.state.dataset.length ?
                <h1>Loading</h1> :
                <Fragment>
                    <header>
                        <ul>
                            <li className="title">Flatten the curve</li>
                            <li className="stick_right">
                                <Popup trigger={<button className="button">Sources</button>} modal>
                                    {close => (
                                        <div className="modal">
                                            <h1>Hospitalisations, Réanimations, Décès et Retours au domicile</h1>
                                            <p>
                                                Ces chiffres sont communiqués quotidiennement à 19h par Santé Publique France. Les informations
                                                relatives à ce jeu de données sont disponibles ici :
                                                <a href="https://www.data.gouv.fr/fr/datasets/donnees-hospitalieres-relatives-a-lepidemie-de-covid-19/">Données hospitalières relatives à l'épidémie de COVID-19</a></p>

                                            <h1>Capacité en réanimation</h1>
                                            <p>
                                                Ces données sont extraites de la Statistique annuelle des établissements de santé (SAE), bases statistiques.
                                                Elles sont disponibles ici : <a href="https://drees.solidarites-sante.gouv.fr/etudes-et-statistiques/publications/article/nombre-de-lits-de-reanimation-de-soins-intensifs-et-de-soins-continus-en-france">Nombre de lits de réanimation, de soins intensifs et de soins continus en France, fin 2013 et 2018</a>
                                            </p>
                                            <p>
                                                Ces chiffres datent de fin 2018 donc bien avant la crise du COVID-19. La capacité en lits de réanimation a été augmentée pour gérer l'augmentation importante du besoin.
                                                Cependant, afficher ce chiffre sur le graphique montre bien la pression qu'on subit les hopitaux durant cette crise sanitaire.
                                            </p>

                                            <p>Si vous remarquez des anomalies ou si vous avez des suggestions d'amélioration, n'hésitez pas à me contacter directement</p>
                                            <ul>
                                                <li><a href="mailto:kv.benard@gmail.com"><FontAwesomeIcon icon={faEnvelope} /></a></li>
                                                <li><a href="https://www.linkedin.com/in/k%C3%A9vin-b%C3%A9nard-b760ba66/"><FontAwesomeIcon icon={faLinkedin} /> </a></li>
                                                <li><a href="https://github.com/kvbenard"><FontAwesomeIcon icon={faGithub} /> </a></li>
                                                <li><a href="https://twitter.com/BnardKv"><FontAwesomeIcon icon={faTwitter} /></a></li>
                                            </ul>

                                            <div className="buttonContainer">
                                                <button
                                                    className="button"
                                                    onClick={() => {
                                                        close();
                                                    }}>
                                                    Fermer
                                                </button>
                                            </div>

                                        </div>
                                    )}
                                </Popup>
                            </li>

                        </ul>
                    </header>

                    <section>
                        <div className="dashboard">
                            <div className="mapConatainer">
                                <Map
                                    data={this.state.dataset}
                                    date={this.state.currentDate.format('YYYY-MM-DD')}
                                    onDepartmentClick={this.onDepartmentClicked}
                                    colors={this.colors}
                                    measure="reanimations" />

                                <RangeInput onChange={this.onChangeHandler} max={this.state.datesSize} />

                                <FilteredElements elements={this.state.departments} onElementDeleted={this.onDepartmentClicked} />

                                <div className='indicatorsContainer'>
                                    <Indicator
                                        name="Hospitalisations"
                                        color={this.colors["hospitalizations"]}
                                        data={this.state.dataset}
                                        measure="hospitalizations"
                                        date={this.state.currentDate.format('YYYY-MM-DD')}
                                        departments={this.state.departments}
                                        onClick={this.onIndicatorClicked} />

                                    <Indicator
                                        name="Réanimations"
                                        color={this.colors["reanimations"]}
                                        data={this.state.dataset}
                                        measure="reanimations"
                                        date={this.state.currentDate.format('YYYY-MM-DD')}
                                        departments={this.state.departments} />

                                    <Indicator
                                        name="Retours à domicile"
                                        color={this.colors["returnHome"]}
                                        data={this.state.dataset}
                                        measure="returnHome"
                                        date={this.state.currentDate.format('YYYY-MM-DD')}
                                        departments={this.state.departments} />

                                    <Indicator
                                        name="Décès"
                                        color={this.colors["deaths"]}
                                        data={this.state.dataset}
                                        measure="deaths"
                                        date={this.state.currentDate.format('YYYY-MM-DD')}
                                        departments={this.state.departments} />
                                </div>
                            </div>

                            <div className="chartsContainer">
                                <LineChart
                                    data={this.state.dataset}
                                    name="Hospitalisations"
                                    measure="hospitalizations"
                                    date={this.state.currentDate.format('YYYY-MM-DD')}
                                    departments={this.state.departments}
                                    color={this.colors["hospitalizations"]} />

                                <LineChart
                                    data={this.state.dataset}
                                    name="Reanimations"
                                    measure="reanimations"
                                    annotation="reanimation_capacity"
                                    date={this.state.currentDate.format('YYYY-MM-DD')}
                                    departments={this.state.departments}
                                    color={this.colors["reanimations"]} />

                                <LineChart
                                    data={this.state.dataset}
                                    measure="returnHome"
                                    name="Retours à domicile"
                                    date={this.state.currentDate.format('YYYY-MM-DD')}
                                    departments={this.state.departments}
                                    color={this.colors["returnHome"]} />

                                <LineChart
                                    data={this.state.dataset}
                                    measure="deaths"
                                    name="Décès"
                                    date={this.state.currentDate.format('YYYY-MM-DD')}
                                    departments={this.state.departments}
                                    color={this.colors["deaths"]} />
                            </div>
                        </div >
                    </section>


                    <footer>
                        <ul>
                            <li className="credit">Kévin Bénard</li>
                            <li><a href="mailto:kv.benard@gmail.com"><FontAwesomeIcon icon={faEnvelope} /></a></li>
                            <li><a href="https://www.linkedin.com/in/k%C3%A9vin-b%C3%A9nard-b760ba66/"><FontAwesomeIcon icon={faLinkedin} /> </a></li>
                            <li><a href="https://github.com/kvbenard"><FontAwesomeIcon icon={faGithub} /> </a></li>
                            <li><a href="https://twitter.com/BnardKv"><FontAwesomeIcon icon={faTwitter} /></a></li>
                        </ul>
                    </footer>
                </Fragment>
        )
    }
}

export default Dashboard;