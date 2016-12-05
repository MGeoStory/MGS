import { Directive, ElementRef, Input, Renderer, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Directive({ selector: 'bar-graph1' })
export class BarGraph implements OnInit {
    graphWidth: number = 500;
    graphHeight: number = 400;
    graph: any;
    dataPath: string = 'app/data/circle.json';
    constructor(
        private el: ElementRef, private renderer: Renderer) {
        // renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'yellow');
        //graph is a selection type
        //append svg是為 了透過attr改變view(CSS可連動),if style則無法透過css覆寫
        var graph = d3.select(el.nativeElement).append('svg');
        // var xScale = d3.scaleLinear()
        //     .domain([0, d3.max(this.data)])
        //     .range([0, this.graphWidth]);
        // graph.selectAll('rect').attr('class', 'rect')
        //     .data(this.data)
        //     .enter().append('rect')
        //     .attr('x', 0)
        //     .attr('y', 100)
        //     .attr('width', 100)
        //     .attr('height', 100)
        //     .attr('fill', 'grey');
        // graph.append('svg')
        //     .attr('class', 'chart')
        //     .attr('width', this.graphWidth + 'px')
        //     .attr('height', this.graphHeight + 'px').selectAll('div')
        //     .data(this.data).enter().append('div')
        //     .attr('width', 10 + 'px');
        // graph.append('svg').append('circle')
        //     .attr('cx', 5)
        //     .attr('cy', 5)
        //     .attr('r', 5);
        // d3.json(this.dataPath, (d) => console.log(d));
        d3.json(this.dataPath, function (data) {
            // console.log(d3.entries(data));
            graph.selectAll('circle').data(data).enter().append('circle')
                .attr('cx', function (data, i) {
                    console.log(d3.keys(data));
                    console.log(d3.values(data));
                    //be a draw-function assign the cx variable
                    //ng-2 implements 
                    console.log(data['color']);

                    //     console.log(data['color']);
                    //     console.log(i);
                    //     // console.log(data[i]);
                    return 1;
                });
            // .attr('cx', (d, i) => d.x_axis);
            // .attr('cy', (d, i) => d[i].y_axis)
            // .attr('r', (d, i) => d[i].radius);
        }
        );
    }

    ngOnInit() {
    }
}