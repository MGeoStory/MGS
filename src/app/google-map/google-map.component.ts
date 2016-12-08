import { Component, OnInit, OnChanges } from '@angular/core';
// import { GoogleMapsLoader } from 'google-maps';
import * as d3 from 'd3';

// import { GoogleMapAPI } from 'googlemaps';
// import * as aa from 'googlemaps';
@Component({
    selector: 'app-google-map',
    templateUrl: 'app-google-map.component.html',
    styleUrls: ['app-google-map.component.css']
})
export class GoogleMapComponent implements OnInit, OnChanges {
    title: string = 'google map';
    lat: number = 23.5;
    lng: number = 121.5;

    ngOnInit(): void {
        var map = new google.maps.Map(document.getElementById('map'),
            {
                zoom: 7,
                center: { lat: 41.85, lng: -87.65 }

            });
    }

    ngOnChanges(): void {

    }

}