import { Component, OnInit } from '@angular/core';
import { MapGraphService } from 'app/shared/map-graph.service';
import * as L from 'leaflet';
import * as d3 from 'd3';

let map: L.Map;
let nullBound: L.LatLngBounds;
let mapboxUrl: string = 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlsZXN3YW5nIiwiYSI6ImNpeGl2NDF1ejAwMTAycWw4cDhoanViaGMifQ.nwPu50GsqxfjSc1t7EsVZA';
let mapboxAttribution: string = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
let mapbox: L.TileLayer;
let geoJSON = L.geoJSON();
let ownComponent: LeafletMapComponent;
let outCountryID;
let countyName: string;

@Component({
    selector: 'app-leaflet-map',
    styleUrls: ['app-leaflet-map.component.css'],
    templateUrl: 'app-leaflet-map.component.html'

}) export class LeafletMapComponent implements OnInit {
    constructor(private mgs: MapGraphService) {
    }

    title: string = 'Leaflet Map';
    countyName = '';
    ngOnInit() {
        //用以在d3裡面讀取.ts的function
        ownComponent = this;
        this.initialMap();
        this.mappingMap();


        d3.csv('app/data/rawdata/simpleTest.csv', function (data: Array<Object>) {
            console.log(data);
            
            //filer
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

        //setting scale bar, compass and other base components 
        mapbox = L.tileLayer(mapboxUrl, {
            attribution: mapboxAttribution,
        });
        map.addLayer(mapbox);
    }// END OF initialMap

    //mapping map
    mappingMap(): void {
        //using d3.json to read file and addTo leaflet map
        d3.json('app/data/geojson/tw_country_ms.json', function (data) {
            // console.log(JSON.stringify(data));
            geoJSON = L.geoJSON(data, {
                style: ownComponent.styleMap,
                //listener event
                onEachFeature: function (feature, layer) {
                    layer.on({
                        click: function (e) {
                            var countyName = feature.properties.COUNTYNAME;
                            ownComponent.updateCountyName(countyName);
                            ownComponent.mgs.announceRefId(countyName);
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
