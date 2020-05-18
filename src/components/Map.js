import React, { PureComponent } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import map from "@amcharts/amcharts4-geodata/franceDepartmentsLow";

/**
 * Construct a map from the AMCharts library
 */
class Map extends PureComponent {

    constructor(props) {
        super(props);

        this.data = this.constructDataset(this.props.data, this.props.maxDate)

    }

    /**
     * Construct dataset specific to this component
     */
    constructDataset = (data, date) => {
        return data.filter(e => ((e.department < 900 || e.department === "2A" || e.department === "2B") && e.date === date)).map(e => {
            return {
                id: "FR-" + e.department,
                value: e.reanimations / e.reanimation_capacity,
                department: e.department
            }
        });
    }

    /**
     * When the component did mount, create the map object and bind the constructed dataset
     */
    componentDidMount() {
        this.chart = am4core.create("french-map", am4maps.MapChart);
        this.chart.geodata = map;
        this.chart.projection = new am4maps.projections.Miller();
        this.chart.responsive.enabled = true;

        // Create map polygon series
        var polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());

        // Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true;

        var polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";

        // Create hover state and set alternative fill color
        let hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#011627");

        hs = polygonTemplate.states.create("active");
        hs.properties.fill = am4core.color("#011627");

        this.chart.series.values[0].data = this.data;

        polygonTemplate.events.on("hit", (ev) => {
            ev.target.isActive = !ev.target.isActive;
            let department = ev.target.dataItem.dataContext.department;

            this.props.onDepartmentClick(department);
        });
    }

    render() {
        return (
            <div style={{ height: "500px", width: "500px" }} id="french-map"></div>
        )
    }
}

export default Map;