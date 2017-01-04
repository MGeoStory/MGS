import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';


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
    map = L.map('lmap').setView([51, 0], 13);

    ngOnInit() {
    }
} 