import { Component, OnInit, OnChanges } from '@angular/core';
import { MapGraphService } from 'app/shared/map-graph.service';
import { LMapSetting } from 'app/shared/lmap-setting';
import { Subscription } from 'rxjs/Subscription';
import { ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';
import * as d3 from 'd3';

let thisComponent: LeafletMapComponent;

let title: string;
let map: L.Map;

//about laafmap
let layerOfGeoJSON: L.GeoJSON;
let featuresClicked: L.FeatureGroup;
let divOfInfoControl: HTMLElement;

//about data
let valueOfFeatures: d3.Map<{}>;

//function for color feature by values
let colorFeature: d3.ScaleLinear<any, any>;

@Component({
    selector: 'app-leaflet-map',
    styleUrls: ['app-leaflet-map.component.css'],
    templateUrl: 'app-leaflet-map.component.html',
    encapsulation: ViewEncapsulation.None //no shoadow DOM.

}) export class LeafletMapComponent implements OnInit {

    private GEOJSON_DATA:string='app/data/geojson/country_tw-ms.json';

    constructor(private mgs: MapGraphService, private lms: LMapSetting) {
    }

    ngOnInit() {
        thisComponent = this;
        this.initialMap();
        thisComponent.mgs.refData.subscribe(
            data => {
                thisComponent.updateInfoControl(null);
                thisComponent.getFeatureInfo(data);
                thisComponent.mappingMap();
            }
        );
    }//END OF ngOnInit

    /**
     * establish a base leaf-map in website
    */
    initialMap(): void {
        //create mapbox and tileLayer
        d3.select('#leaf-map').attr('id', 'lmap');
        map = L.map('lmap').setView([23.5, 121], 6);
        map.addLayer(thisComponent.lms.basedMap());

        map.addControl(this.createInfoControl());

    }// END OF initialMap

    /**
     * crate control(window) on map
     */
    createInfoControl(): L.Control {

        //control will upon leaflet map
        let infoControl = L.control.attribution({ position: 'topright' });
        //add HTMLElement
        infoControl.onAdd = () => {
            divOfInfoControl = L.DomUtil.create('div');
            divOfInfoControl.className = 'infoControl';
            thisComponent.updateInfoControl(null);
            return divOfInfoControl;
        };
        return infoControl;
    }//.createInfoControl

    /**
     * deal the control of infomation about user click
     */
    updateInfoControl(props) {
        //the props are the feature
        if (props != null) {
            let countryName = props['COUNTYNAME'];
            //get feature value from data that pass by dropdwon list
            if (valueOfFeatures.get(props['COUNTYID']) != null) {
                let valueOfCountry = valueOfFeatures.get(props['COUNTYID'])['value'];
                divOfInfoControl.innerHTML = `<h4>${countryName}</h4><b>平均客單價：${valueOfCountry}</b>`;
            } else {
                divOfInfoControl.innerHTML = `<h4>${countryName}</h4><b>平均客單價：無資料</b>`;
            }
        } else {
            divOfInfoControl.innerHTML = '<h4>click country</h4>';
        }
    }//.updateInfoCOntrol

    /**
     * get values from data, pass data to leafMap and draw layers 
     */
    getFeatureInfo(data: Array<Object>): void {
        //extent would read all data[set] and return values
        let extentOfData = d3.extent(data, d => {
            return d['平均客單價'];
        });
        // console.log(extentOfData);
        //why <string>? https://github.com/DefinitelyTyped/DefinitelyTyped/issues/8941
        colorFeature = d3.scaleLinear<string>()
            .domain(extentOfData)
            .range(["#FFEDA0", "#800026"]);

        //d3.map would create a map<key:object>; the key and object are from data.map
        valueOfFeatures = d3.map(
            //data.map would create a array<objecct>
            data.map(d => {
                return {
                    id: d['縣市代碼'],
                    value: d['平均客單價']
                }
            }), (d) => {
                return d['id']
            }
        );//end of valueOfFeatures
    }// end of getFeatureInfo

    /**
     * use d3.json read .json file and pass to L.genoJSON to layout.
     */
    mappingMap(): void {
        //using d3.json to read file and addTo leaflet map
        d3.json(this.GEOJSON_DATA, function (data) {
            //remove the existed layer.
            if (map.hasLayer(layerOfGeoJSON)) {
                map.removeLayer(layerOfGeoJSON);
            }
            // console.log(JSON.stringify(data));
            // let countryID = data['features'][0]['properties']['COUNTYID'];
            layerOfGeoJSON = L.geoJSON(data, {
                style: thisComponent.styleFeature,
                //listener event
                onEachFeature: function (feature, layer) {
                    layer.on({
                        click: function (e) {
                            var countyName = feature.properties['COUNTYNAME'];
                            thisComponent.mgs.announceRefId(countyName);
                            thisComponent.resetHighlightedFeature();
                            thisComponent.highlightFeature(e);
                            thisComponent.updateInfoControl(feature.properties);
                        }
                    });//.layer.on
                }//.onEachFeature
            });
            //add geoJson and zoom to geoJSON
            layerOfGeoJSON.addTo(map);
            //if zoom at tiawan => set common view is better.
            map.fitBounds(layerOfGeoJSON.getBounds());
        });
    }// END OF mappingMap

    /**
     * rest the highlight feature
     */
    resetHighlightedFeature() {
        if (layerOfGeoJSON.hasLayer(featuresClicked)) {
            layerOfGeoJSON.resetStyle(featuresClicked);
        }
    }

    /**
     * highlight the feature that user clicked
     */
    highlightFeature(e: L.Event) {
        // console.log(e.target);
        featuresClicked = e.target;
        featuresClicked.setStyle({
            weight: 4,
            color: '#666',
            dashArray: '',
            fillOpacity: 1
        });

        if (!L.Browser.ie && !L.Browser.edge) {
            featuresClicked.bringToFront();
        }
    }

    /**
     * set the style of features
     */
    styleFeature(feature: Object) {
        // console.log(dataDealed);
        let countryId: string = feature['properties']['COUNTYID'];
        return {
            fillColor: thisComponent.getFillColor(countryId),
            fillOpacity: 0.9,
            color: 'gray',
            dashArray: '3',
            weight: 1.5
        };
    }//END of styleMap

    /**
     * get fill color of features by countryID.
     * if value=0 , the fill color is gray.
     */
    getFillColor(countryId: string): string {
        //26 countries in Taiwan will show in map, but the data would be lack
        let valueOfCountry: number;
        if (valueOfFeatures.get(countryId) != null) {
            valueOfCountry = valueOfFeatures.get(countryId)['value'];
            // console.log(valueOfCountry);
            // return rgbHex('#'+colorFeature(valueOfCountry));
            // console.log('#' + rgbHex(colorFeature(valueOfCountry)));
            // console.log(colorFeature(valueOfCountry));
            return colorFeature(valueOfCountry);
        } else {
            valueOfCountry = 0;
            return ('LightGrey');
        }
    }//END OF getFillColor
} //END OF class
