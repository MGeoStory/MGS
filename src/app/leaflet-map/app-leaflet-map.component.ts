import { Component, OnInit } from '@angular/core';
import { MapGraphService } from 'app/shared/map-graph.service';
import * as L from 'leaflet';
import * as d3 from 'd3';
import {LMapSetting} from 'app/shared/lmap-setting';

let map: L.Map;
let mapbox: L.TileLayer;
let geoJSON = L.geoJSON();
let thisComponent: LeafletMapComponent;
let outCountryID;
let countyName: string;
let test ={};

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
        console.log(thisComponent.lms.mapboxUrl);
        this.initialMap();
        this.mappingMap();


        d3.csv('app/data/rawdata/simpleTest.csv', function (data: Array<Object>) {
            console.log(data);
            
            //filer smartly by 發票年月and 縣市代碼 
            data = data.filter(function (d) {
                    console.log(d['縣市代碼']);
                return {
                    // d.縣市代碼 == 'A';
                }
            });

            //rebuilding data by 發票年月 and 縣市代碼 and 平均開立張數

        });


    }//END OF ngOnInit

    //establish a base leaf-map in website
    initialMap(): void {
        //create mapbox and tileLayer
        d3.select('div').attr('id', 'lmap');
        map = L.map('lmap').setView([0, 0], 5);

        
        // mapbox = L.tileLayer(thisComponent.lms.mapboxUrl, {
        //     attribution: thisComponent.lms.mapboxAttribution,
        // });
        map.addLayer(thisComponent.lms.mapboxTileLayer);
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
