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
    // lat: number = 23.5;
    // lng: number = 121.5;
    ngOnInit(): void {
        // map is a div's id in html
        var map = new google.maps.Map(document.getElementById('map'),
            {
                zoom: 6,
                center: new google.maps.LatLng(37.76487, -122.41948),
                mapTypeId: google.maps.MapTypeId.TERRAIN
            });

        d3.json("app/data/stations.json", function (error, data) {
            if (error) throw error;

            var overlay = new google.maps.OverlayView();

            overlay.onAdd = function () {
                var layer = d3.select(this.getPanes().overlayLayer).append('div')
                    .attr('class', 'stations');
            }

        });
    }

    ngOnChanges(): void {

    }

}