import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as d3 from 'd3';

let map: L.Map;
let nullBound: L.LatLngBounds;


@Component({
    selector: 'app-leaflet-map',
    templateUrl: 'app-leaflet-map.component.html',
    styleUrls: ['app-leaflet-map.component.css']

}) export class LeafletMapComponent implements OnInit {
    title: string = 'Leaflet Map';

    ngOnInit() {
        d3.select('div').attr('id', 'lmap');
        map = L.map('lmap').setView([0, 0], 5);
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlsZXN3YW5nIiwiYSI6ImNpeGl2NDF1ejAwMTAycWw4cDhoanViaGMifQ.nwPu50GsqxfjSc1t7EsVZA', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        }).addTo(map);


        d3.json("app/data/stations.json", function (error, data) {
            if (error) throw error;
            nullBound = L.latLngBounds(null, null);
            d3.entries(data).forEach(function (d) {
                d.value.lat_lng = L.latLng([d.value[1], d.value[0]]);
                var circle = L.circle(d.value.lat_lng, {
                    radius: 200,
                }).addTo(map);
                // map.addLayer(circle); //也可

                // fit the circles
                var bounds = nullBound.extend(d.value.lat_lng);
                map.fitBounds(bounds);
                circle.on('mouseover', function (d) {
                    var layer = d.target;
                    console.log(d.target);
                    layer.setStyle({ color: 'red' });
                    // console.log(layer.feature);
                    //geojson 專用
                    // console.log(layer.feature.properties);
                })
            });


        });//END OF d3.json

    }//END OF ngOnInit
} 