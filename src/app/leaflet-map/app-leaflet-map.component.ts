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
        ownComponent = this;
        //create mapbox and tileLayer
        d3.select('div').attr('id', 'lmap');
        map = L.map('lmap').setView([0, 0], 5);

        mapbox = L.tileLayer(mapboxUrl, {
            attribution: mapboxAttribution,
        });
        map.addLayer(mapbox);

        //using d3.json to read file and addTo leaflet map
        d3.json('app/data/geojson/tw_country_ms.json', function (data) {
            // console.log(JSON.stringify(data));

            geoJSON = L.geoJSON(data, {
                // style: function (feature) {
                //     return { color: 'red' };
                // },
                style: ownComponent.style,
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


            // console.log(this);
            geoJSON.addTo(map);
            map.fitBounds(geoJSON.getBounds());
            // console.log('added');
        });
    }//END OF ngOnInit

    //style of COUNTY_stoneman
    style(feature) {
        return {
            "color": "red",
        };
    }

    // passing map click info to html(<p>) 
    updateCountyName(countyName) {
        this.countyName = countyName;
    }
} //END OF export
