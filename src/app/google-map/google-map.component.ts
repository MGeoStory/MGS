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
export class GoogleMapComponent implements OnInit {
    title: string = 'google map';

    ngOnInit(): void {
        console.log('ngOnInit');
        var map = new google.maps.Map(document.getElementById('map'),
            {
                zoom: 20,
                center: new google.maps.LatLng(37.76487, -122.41948),
                mapTypeId: google.maps.MapTypeId.TERRAIN
            });

        // Load the station data. When the data comes back, create an overlay.
        d3.json("app/data/stations.json", function (error, data) {
            console.log(d3.entries(data));
            var bounds = new google.maps.LatLngBounds();
            //d3.entries({foo: 42, bar: true}); // [{key: "foo", value: 42}, {key: "bar", value: true}]
            d3.entries(data).forEach(function (d) {
                //Extends this bounds to contain the given point.
                //create value:lat_lng , lat,lng
                bounds.extend(d.value.lat_lng = new google.maps.LatLng(d.value[1], d.value[0]));
                //Sets the viewport to contain the given bounds.
                map.fitBounds(bounds);
            });
            var overlay = new google.maps.OverlayView(),
                r = 4.5,
                padding = r * 2;
            overlay.onAdd = function () {
                //this is mean overlay class
                // console.log(d3.select(this.getPanes()));
                var layer = d3.select(this.getPanes().overlayLayer)
                    .append('svg')
                    .attr('class', 'stations');

                overlay.draw = function () {
                    var projection = this.getProjection(),
                        sw = projection.fromLatLngToDivPixel(bounds.getSouthWest()),
                        ne = projection.fromLatLngToDivPixel(bounds.getNorthEast());
                    // extend the boundaries so that markers on the edge aren't cut in half
                    sw.x -= padding;
                    sw.y += padding;
                    ne.x += padding;
                    ne.y -= padding;
                    // console.log(ne.x);
                    // console.log(sw.x);

                    d3.select('.stations')
                        .attr('width', (ne.x - sw.x) + 'px')
                        .attr('height', (sw.y - ne.y) + 'px')
                        .style('position', 'absolute')
                        .style('left', sw.x + 'px')
                        .style('top', ne.y + 'px')
                        .style('background-color', 'rgba(0,0,0,.5)');

                    //create point
                    var maker = layer.selectAll('.marker')
                        .data(d3.entries(data))
                        .each(transform) // for updating，首次loading map不call，後續會作
                        .enter()
                        .append('circle')
                        .attr('class', 'marker')
                        .attr('r', r)
                        .attr('cx', function (d) { //這邊開始是初始化的point，後續不call
                            console.log('enter cx');
                            var p = new google.maps.Point(0, 0); //point class
                            p = projection.fromLatLngToDivPixel(d.value.lat_lng);
                            // console.log(p.x);
                            // console.log(sw.x);
                            // console.log(p.x - sw.x);
                            console.log('p=' + (p.x - sw.x));
                            return p.x - sw.x;
                        })
                        .attr('cy', function (d) {
                            var p = new google.maps.Point(0, 0); //point class
                            p = projection.fromLatLngToDivPixel(d.value.lat_lng);
                            return p.y - ne.y;
                        }).append('title').text(function (d) {
                            return d.key;
                        });

                    //讓點位能隨著地圖縮放而不改變位置
                    function transform(d) {
                        // console.log(d);
                        d = projection.fromLatLngToDivPixel(d.value.lat_lng);
                        console.log('d=' + (d.x - sw.x));
                        return d3.select(this)
                            .attr('cx', d.x - sw.x) //因為absolute了sw.x的距離
                            .attr('cy', d.y - ne.y);// 因為 absolute了ne.y的距離
                    }
                };
            }
            // Bind our overlay to the map…
            overlay.setMap(map);
        });
    };
}
