import { Component, OnInit, OnChanges } from '@angular/core';
import { MapGraphService } from 'app/shared/map-graph.service';
import { LMapSetting } from 'app/shared/lmap-setting';
import { Subscription } from 'rxjs/Subscription';
import * as L from 'leaflet';
import * as d3 from 'd3';
// import * as rgbHex from 'rgb-hex';
const rgbHex = require('rgb-hex');

let thisComponent: LeafletMapComponent;
let map: L.Map;
let geoJSON: L.GeoJSON;
let valueOfFeatures: d3.Map<{}>;
let valueOfFeaturesTest: Array<Object>;
let title: string;

//function for color feature by values
let colorFeature: d3.ScaleLinear<any, any>;

@Component({
    selector: 'app-leaflet-map',
    styleUrls: ['app-leaflet-map.component.css'],
    templateUrl: 'app-leaflet-map.component.html'

}) export class LeafletMapComponent implements OnInit {
    constructor(private mgs: MapGraphService, private lms: LMapSetting) {
    }

    ngOnInit() {
        thisComponent = this;
        this.initialMap();
        thisComponent.mgs.refData.subscribe(
            data => {
                // thisComponent.mappingMap();
                thisComponent.getFeatureInfo(data);
                // thisComponent.setFeatureInfo();
                thisComponent.mappingMap();
            }
        );

        //call functions of this component in d3 loop
        // this.initialMap();
        // this.setFeatureInfo();
        // this.mappingMap();
    }//END OF ngOnInit

    /**
     * establish a base leaf-map in website
    */
    initialMap(): void {
        //create mapbox and tileLayer
        d3.select('div').attr('id', 'lmap');
        map = L.map('lmap').setView([0, 0], 5);
        map.addLayer(thisComponent.lms.basedMap());
    }// END OF initialMap

    /**
     * get values from data, pass data to leafMap and draw layers 
     */
    getFeatureInfo(data: Array<Object>): void {
        console.log(data);
        // console.log(data[0]['平均客單價']);
        //extent would read all data[set] and return values
        let extentOfData = d3.extent(data, d => {
            return d['平均客單價'];
        })
        //why <string>? https://github.com/DefinitelyTyped/DefinitelyTyped/issues/8941
        colorFeature = d3.scaleLinear<string>()
            .domain(extentOfData)
            .range(["white", "OrangeRed"]);

        valueOfFeaturesTest = data.map(d => {
            return {
                id: d['縣市代碼'],
                value: d['平均客單價']
            }
        });
        console.log(valueOfFeaturesTest);

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
        d3.json('app/data/geojson/tw_country_ms.json', function (data) {
            // console.log(JSON.stringify(data));
            // let countryID = data['features'][0]['properties']['COUNTYID'];
            geoJSON = L.geoJSON(data, {
                style: thisComponent.styleFeature,
                //listener event
                onEachFeature: function (feature, layer) {
                    layer.on({
                        click: function (e) {
                            var countyName = feature.properties.COUNTYNAME;
                            thisComponent.mgs.announceRefId(countyName);
                        }
                    });
                }
            });
            //add geoJson and zoom to geoJSON
            geoJSON.addTo(map);
            map.fitBounds(geoJSON.getBounds());
        });
    }// END OF mappingMap

    /**
     * set the style of features
     */
    styleFeature(feature: Object) {
        // console.log(dataDealed);
        let countryId: string = feature['properties']['COUNTYID'];
        return {
            fillColor: thisComponent.getFillColor(countryId),
            fillOpacity: 0.9,
            color: "gray",
            weight: 1
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
            // return rgbHex('#'+colorFeature(valueOfCountry));
            // console.log('#' + rgbHex(colorFeature(valueOfCountry)));
            return '#' + rgbHex(colorFeature(valueOfCountry));
        } else {
            valueOfCountry = 0;
            return 'gray';
        }
    }//END OF getFillColor
} //END OF class
