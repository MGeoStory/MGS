import { Component } from '@angular/core';

@Component({
    selector: 'app-google-map',
    templateUrl: 'app-google-map.component.html',
    styleUrls: ['app-google-map.component.css']
})
export class GoogleMapComponent {
    title: string = 'google map';
    lat: number = 23.5;
    lng: number = 121.5;
}