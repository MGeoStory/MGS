import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as d3 from 'd3';

let map;

@Component({
    selector: 'app-leaflet-map',
    templateUrl: 'app-leaflet-map.component.html',
    styleUrls: ['app-leaflet-map.component.css']

}) export class LeafletMapComponent implements OnInit {
    title: string = 'Leaflet Map';

    ngOnInit() {
        d3.select('div').attr('id', 'lmap');
        map = L.map('lmap').setView([51, 0], 13);


    }
} 