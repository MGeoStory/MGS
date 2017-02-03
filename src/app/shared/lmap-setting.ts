import * as L from 'leaflet';

//
export class LMapSetting {
    mapboxTileLayer: L.TileLayer;
    mapboxUrl: string;
    mapboxAttribution: string;

    testMap():L.TileLayer{
        this.mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlsZXN3YW5nIiwiYSI6ImNpeGl2NDF1ejAwMTAycWw4cDhoanViaGMifQ.nwPu50GsqxfjSc1t7EsVZA';
        this.mapboxAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
        
        //setting scale bar, compass and other base components 
        this.mapboxTileLayer = L.tileLayer(this.mapboxUrl, {
            attribution: this.mapboxAttribution,
        });

        return this.mapboxTileLayer;
    }
}