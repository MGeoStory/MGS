import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as d3 from 'd3';

let map: L.Map;
let nullBound: L.LatLngBounds;
let mapboxUrl: string = 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlsZXN3YW5nIiwiYSI6ImNpeGl2NDF1ejAwMTAycWw4cDhoanViaGMifQ.nwPu50GsqxfjSc1t7EsVZA';
let mapboxAttribution: string = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
let mapbox: L.TileLayer;
let overlaySVG = d3.select('null');
let g = d3.select('null');
let geoJSON;
let component;

@Component({
    selector: 'app-leaflet-map',
    templateUrl: 'app-leaflet-map.component.html',
    styleUrls: ['app-leaflet-map.component.css']

}) export class LeafletMapComponent implements OnInit {
    title: string = 'Leaflet Map';
    ngOnInit() {
        //create mapbox and tileLayer
        d3.select('div').attr('id', 'lmap');
        map = L.map('lmap').setView([0, 0], 5);

        mapbox = L.tileLayer(mapboxUrl, {
            attribution: mapboxAttribution,
        });
        map.addLayer(mapbox);

        //create country of TW
        overlaySVG = d3.select(map.getPanes().overlayPane).append('svg');
        g = overlaySVG.append('g').attr('class', 'leaflet-zoom-hide');


        var geojsonFeature = {
            "type": "Feature",
            "properties": {
                "name": "Coors Field",
                "amenity": "Baseball Stadium",
                "popupContent": "This is where the Rockies play!"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-104.99404, 39.75621]
            }
        };
        L.geoJSON(geojsonFeature).addTo(map);
        // L.geoJSON().addTo(map).addData(geojsonFeature);
        // var test = require('app/data/OUNTY_stoneman-ms.json');
        // console.log(test);
        var myLines;

        myLines = [{
            "type": "LineString",
            "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
        }, {
            "type": "LineString",
            "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
        }];

        var polygon;

        polygon = [{
            "type": "Polygon",
            "coordinates": [
                [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
            ]
        }];

        // console.log(this);

        component = this;
        //using d3.json to read file and addTo leaflet map
        d3.json('app/data/COUNTY_stoneman-ms.json', function (data) {
            // console.log(JSON.stringify(data));
            geoJSON = L.geoJSON();
            console.log(geoJSON);
            // console.log(this);
            //asyn problems
            
            geoJSON.addData(data, {
                onEachFeature: component.onEachFeature
            }).addTo(map);
            // console.log('added');
        });

        //add circle
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

    highlightFeature(e) {
        var layer = e.target;
        layer.setStye({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
    }

    resetHighlight(e) {
        geoJSON.resetHighlight(e.target);
    }

    zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    onEachFeature(feature, layer) {
        console.log('onEachFeature');
        layer.on({
            mouseover: this.highlightFeature,
            mouseout: this.resetHighlight,
            click: this.zoomToFeature
        });
    }

    style(feature) {
    return {
        fillColor: getColor(feature.properties.COUNTYCODE),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };

    function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}
}

} //END OF export
