import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
    selector: 'app-leaflet-map',
    templateUrl: 'app-leaflet-map.component.html',
    styleUrls: ['app-leaflet-map.component.css']
}) export class LeafletMapComponent {
    title: string = 'Leaflet Map';
    //Map container not found.
    //This problem occurs when L.map('map') is called before the DOM has finished loading.
    // map = L.map('leafMap').setView([51, 51], 13);
} 