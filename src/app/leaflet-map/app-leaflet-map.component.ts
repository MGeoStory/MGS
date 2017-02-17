import { Component, OnInit, OnChanges } from '@angular/core';
import { MapGraphService } from 'app/shared/map-graph.service';
import { LMapSetting } from 'app/shared/lmap-setting';
import { Subscription } from 'rxjs/Subscription';
import * as L from 'leaflet';
import * as d3 from 'd3';

// import * as rgbHex from 'rgb-hex';
const rgbHex = require('rgb-hex');

let map: L.Map;
let geoJSON: L.GeoJSON;
let thisComponent: LeafletMapComponent;
let dataDealed: d3.Map<{}>;
let colorFeature: d3.ScaleLinear<any, any>;
let refYear: string;
let title: string;

@Component({
    selector: 'app-leaflet-map',
    styleUrls: ['app-leaflet-map.component.css'],
    templateUrl: 'app-leaflet-map.component.html'

}) export class LeafletMapComponent implements OnInit {
    title = '+++' + refYear;
    constructor(private mgs: MapGraphService, private lms: LMapSetting) {
        //test
        refYear = '2013/2/1';
        mgs.refYear.subscribe(
            year => {
                refYear = year;
                // console.log(refYear);
            }
        );
    }

    ngOnInit() {

        thisComponent = this;
        thisComponent.mgs.refYear.subscribe(
            year => {
                refYear = year;
                console.log(refYear);
                this.initialMap();
                this.setFeatureInfo(refYear);
                this.mappingMap();
            }
        );
        //call functions of this component in d3 loop
        this.initialMap();
        this.setFeatureInfo('2013/1/1');
        this.mappingMap();
    }//END OF ngOnInit

    ngOnChanges() {
        var title = refYear;
    }
    //establish a base leaf-map in website
    initialMap(): void {
        //create mapbox and tileLayer
        d3.select('div').attr('id', 'lmap');
        map = L.map('lmap').setView([0, 0], 5);
        map.addLayer(thisComponent.lms.testMap());
    }// END OF initialMap

    //parsing data for color of feature
    setFeatureInfo(refYear:string): void {
        //https://github.com/d3/d3-time-format
        var parseTime = d3.timeParse("%Y/%m/%d");

        //grouping data::http://learnjsdata.com/group_data.html
        d3.csv('app/data/rawdata/simpleTest.csv', function (data: Array<Object>) {
            //1. filter data
            var dataFiltered = data
                .filter(column => {
                    if (column['發票年月'] == refYear && column['行業名稱'] == '便利商店') {
                        return column;
                    }
                });
            console.log(dataFiltered);
            //2. adjust format
            dataFiltered.forEach(d => {
                //deal time and numbers format
                d['發票年月'] = parseTime(d['發票年月']);
                d['平均客單價'] = +d['平均客單價'];
                d['平均開立張數'] = +d['平均開立張數'];
                d['平均開立金額'] = +d['平均開立金額'];
            });

            //the paras in d3.extent() is array[], so build up a simple array
            var valuesOfData;

            valuesOfData = dataFiltered.map((d) => {
                return {
                    countryID: d['縣市代碼'],
                    value: d['平均客單價']
                }
            });
            var extentOfData = d3.extent(valuesOfData, function (d) {
                return d['value'];
            });
            console.log(extentOfData);

            // console.log(dataFiltered);
            //3. nest data by縣市代碼
            var dataNested = d3.nest()
                .key(d => { return d['縣市代碼'] })
                .entries(dataFiltered);
            console.log(dataNested);

            //4. map data(make data simplify) by what the map need
            var dataMapped = dataNested.map((d) => {
                // console.log(d.key);
                // console.log(d.values[0]['平均客單價']);
                return {
                    key: d.key,
                    value: d.values[0]['平均客單價']
                }
            });
            //5.using key to select value of data
            dataDealed = d3.map(dataMapped, (d) => {
                return d.key;
            });
            // console.log(dataDealed);
            // console.log(dataDealed.get('A')['value']);

            //why <string>? https://github.com/DefinitelyTyped/DefinitelyTyped/issues/8941
            colorFeature = d3.scaleLinear<string>()
                .domain(extentOfData)
                .range(["white", "OrangeRed"]);
            console.log(colorFeature(77));
            console.log(rgbHex(colorFeature(77)));

        });
    }

    //mapping map
    mappingMap(): void {
        //using d3.json to read file and addTo leaflet map
        d3.json('app/data/geojson/tw_country_ms.json', function (data) {
            // console.log(JSON.stringify(data));
            // let countryID = data['features'][0]['properties']['COUNTYID'];
            geoJSON = L.geoJSON(data, {
                style: thisComponent.styleMap,
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

    //style of polygon (feature is the object of data)
    styleMap(feature: Object) {
        // console.log(dataDealed);
        var countryId: string = feature['properties']['COUNTYID'];

        return {
            fillColor: thisComponent.getFillColor(countryId),
            fillOpacity: 0.9,
            color: "gray",
            weight: 1
        };
    }//END of styleMap

    getFillColor(countryId: string): string {
        //26 countries in Taiwan will show in map, but the data would be lack
        var valueOfCountry: number;
        if (dataDealed.get(countryId) != null) {
            valueOfCountry = dataDealed.get(countryId)['value'];
            // return rgbHex('#'+colorFeature(valueOfCountry));
            // console.log('#' + rgbHex(colorFeature(valueOfCountry)));
            return '#' + rgbHex(colorFeature(valueOfCountry));
        } else {
            valueOfCountry = 0;
            return 'gray';
        }

        // console.log(countryId + ", " + valueOfCountry);
        // return 'red';
    }//END OF getFillColor
} //END OF export
