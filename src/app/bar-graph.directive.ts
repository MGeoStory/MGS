import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import * as d3 from 'd3';

@Directive({ selector: 'bar-graph' })
export class BarGraph {
    graphWidth: number = 500;
    graphHeight: number = 400;
    graph: any;
    data: Array<number> = [10, 20, 30, 40, 60];
    constructor(
        el: ElementRef, renderer: Renderer) {
        // renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'yellow');

        //graph is a selection type
        //append svg是為 了透過attr改變view(CSS可連動),if style則無法透過css覆寫
        var graph = d3.select(el.nativeElement).append('svg');
        var xScale = d3.scaleLinear()
            .domain([0, d3.max(this.data)])
            .range([0, this.graphWidth]);

        graph.selectAll('rect').attr('class', 'rect')
            .data(this.data)
            .enter().append('rect')
            .attr('x', 0)
            .attr('y', 100)
            .attr('width', 100)
            .attr('height', 100)
            .attr('fill', 'grey');
        // graph.append('svg')
        //     .attr('class', 'chart')
        //     .attr('width', this.graphWidth + 'px')
        //     .attr('height', this.graphHeight + 'px').selectAll('div')
        //     .data(this.data).enter().append('div')
        //     .attr('width', 10 + 'px');
        graph.append('svg').append('circle')
            .attr('cx', 5)
            .attr('cy', 5)
            .attr('r', 5);
    }

}