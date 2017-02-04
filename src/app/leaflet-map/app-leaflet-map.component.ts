import { Component, OnInit } from '@angular/core';
import { MapGraphService } from 'app/shared/map-graph.service';
import { LMapSetting } from 'app/shared/lmap-setting';
import * as L from 'leaflet';
import * as d3 from 'd3';

let map: L.Map;
let geoJSON = L.geoJSON();
let thisComponent: LeafletMapComponent;
let outCountryID;
let countyName: string;
let csvFilters;

@Component({
    selector: 'app-leaflet-map',
    styleUrls: ['app-leaflet-map.component.css'],
    templateUrl: 'app-leaflet-map.component.html'

}) export class LeafletMapComponent implements OnInit {

    constructor(private mgs: MapGraphService, private lms: LMapSetting) {
    }

    //set variables
    title: string = 'Leaflet Map';
    countyName = '';

    ngOnInit() {

        //用以在d3裡面讀取.ts的function
        thisComponent = this;
        this.initialMap();
        this.mappingMap();

        //https://github.com/d3/d3-time-format
        var parseTime = d3.timeParse("%Y/%m/%d");

        //grouping data::http://learnjsdata.com/group_data.html
        d3.csv('app/data/rawdata/simpleTest.csv', function (data: Array<Object>) {

            //1. filter data
            var dataFiltered = data
                .filter(column => {
                    if (column['發票年月'] == '2013/01/01' || column['行業名稱'] == '便利商店') {
                        return column;
                    }
                });
            //2. adjust format
            dataFiltered.forEach(d => {
                //處理time and numbers format
                d['發票年月'] = parseTime(d['發票年月']);
                d['平均客單價'] = +d['平均客單價'];
                d['平均開立張數'] = +d['平均開立張數'];
                d['平均開立金額'] = +d['平均開立金額'];
            });
            console.log(dataFiltered);
            //3. map data
            //4. nest data by縣市代碼
            var dataNested = d3.nest()
                .key(d=>{return d['縣市代碼']})
                .entries(dataFiltered);
            console.log(dataNested);
            //5. reading

            // var a = d3.values(nestData).map(function (d) {
            //     return d.values
            // });
            // console.log(a);
        });
    }//END OF ngOnInit

    //establish a base leaf-map in website
    initialMap(): void {
        //create mapbox and tileLayer
        d3.select('div').attr('id', 'lmap');
        map = L.map('lmap').setView([0, 0], 5);
        map.addLayer(thisComponent.lms.testMap());
    }// END OF initialMap

    //mapping map
    mappingMap(): void {
        //using d3.json to read file and addTo leaflet map
        d3.json('app/data/geojson/tw_country_ms.json', function (data) {
            // console.log(JSON.stringify(data));
            geoJSON = L.geoJSON(data, {
                style: thisComponent.styleMap,
                //listener event
                onEachFeature: function (feature, layer) {
                    layer.on({
                        click: function (e) {
                            var countyName = feature.properties.COUNTYNAME;
                            thisComponent.updateCountyName(countyName);
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


    //style of polygon
    styleMap(feature) {
        return {
            "color": "red",
        };
    }//END of styleMap



    // passing map click info to html(<p>) 
    updateCountyName(countyName) {
        this.countyName = countyName;
    }
} //END OF export
