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

        d3.json(this.dataPath, function (data) {

            // graph.selectAll('circle').data(data).enter().append('circle')
            //     .attr('cx', (d) => d['x_axis'])
            //     .attr('cy', (d) => d['y_axis'])
            //     .attr('r', (d) => d['radius']);
        }
        );
    }

    ngOnInit() {
    }
}