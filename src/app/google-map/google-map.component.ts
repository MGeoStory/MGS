import { Component, OnInit, OnChanges, ViewEncapsulation, AfterContentInit } from '@angular/core';
import * as d3 from 'd3';

let map: google.maps.Map;
let bounds: google.maps.LatLngBounds;
let overlayView: google.maps.OverlayView;
let layerOfStation;

@Component({
    selector: 'app-google-map',
    templateUrl: 'app-google-map.component.html',
    encapsulation: ViewEncapsulation.None, //view不封裝的話，css可操作angular2的ng-style(any class)
    styleUrls: ['app-google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
    title: string = 'google map';

    ngOnInit(): void {
        this.initialize();

        // Load the station data. When the data comes back, create an overlay.
        d3.json("app/data/stations.json", function (error, data) {
            // console.log(d3.entries(data));
            //d3.entries({foo: 42, bar: true}); // [{key: "foo", value: 42}, {key: "bar", value: true}]
            d3.entries(data).forEach(function (d) {
                //Extends this bounds to contain the given point.
                //create value:lat_lng , lat,lng
                bounds.extend(d.value.lat_lng = new google.maps.LatLng(d.value[1], d.value[0]));
                //Sets the viewport to contain the given bounds.
                map.fitBounds(bounds);
            });// END OF d3.entries

            overlayView.draw = function () {
                var projection = this.getProjection(),
                    sw = projection.fromLatLngToDivPixel(bounds.getSouthWest()),
                    ne = projection.fromLatLngToDivPixel(bounds.getNorthEast()),
                    r = 4.5,
                    padding = r * 2;
                // extend the boundaries so that markers on the edge aren't cut in half
                sw.x -= padding;
                sw.y += padding;
                ne.x += padding;
                ne.y -= padding;

                d3.select('.stations')
                    .attr('width', (ne.x - sw.x) + 'px')
                    .attr('height', (sw.y - ne.y) + 'px')
                    .style('position', 'absolute')
                    .style('left', sw.x + 'px')
                    .style('top', ne.y + 'px');

                //create point
                var maker = layerOfStation.selectAll('.marker')
                    .data(d3.entries(data))
                    .each(transform) // for updating，首次loading map不call，後續會作
                    .enter()
                    .append('circle')
                    .attr('class', 'marker')
                    .attr('r', r)
                    .attr('cx', function (d) { //這邊開始是初始化的point，後續不call
                        d = projection.fromLatLngToDivPixel(d.value.lat_lng);// d不同
                        return d.x - sw.x;
                    })
                    .attr('cy', function (d) {
                        d = projection.fromLatLngToDivPixel(d.value.lat_lng);
                        return d.y - ne.y;
                    }).append('title').text(function (d) {
                        return d.key;
                    });

                //讓點位能隨著地圖縮放而不改變位置
                function transform(d) {
                    d = projection.fromLatLngToDivPixel(d.value.lat_lng);
                    //this = SVGCircleElement
                    return d3.select(this)
                        .attr('cx', d.x - sw.x) //因為absolute了sw.x的距離
                        .attr('cy', d.y - ne.y);// 因為 absolute了ne.y的距離
                }// END OF transform
            };// END OF overlayView.draw
            // Bind our overlay to the map
            overlayView.setMap(map);
        }); // END OF d3.json
    }; // END OF OnInit

    //看起來map跟class name，可以改為parameter，轉為service
    // set global variables
    initialize(): void {
        var mapOptions = { zoom: 2, mapTypeId: google.maps.MapTypeId.TERRAIN };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        //caculate the lat lng position
        bounds = new google.maps.LatLngBounds();

        //draw my layer
        overlayView = new google.maps.OverlayView();
        overlayView.onAdd = function () {
            //this = overlayView
            //overlayMouseTarget =>可以listener DOM event; google map有4層Panes
            layerOfStation = d3.select(this.getPanes().overlayMouseTarget)
                .append('svg')
                .attr('class', 'stations');
        }
    }// END OF initialize
}

