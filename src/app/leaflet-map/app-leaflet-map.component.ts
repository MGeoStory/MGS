import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as d3 from 'd3';


let map;
let mapboxOSM: string;
let mapboxId: string;
let mapboxToken: string;
@Component({
    selector: 'app-leaflet-map',
    templateUrl: 'app-leaflet-map.component.html',
    styleUrls: ['app-leaflet-map.component.css']
}) export class LeafletMapComponent implements OnInit {
    title: string = 'Leaflet Map';

    ngOnInit() {
        console.log(document.getElementById('lmap'));

        map = L.map(document.getElementById('lmap')).setView([51, 0], 13);
        // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}').addTo(map);
    }
} 