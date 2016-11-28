import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import * as d3 from 'd3';

@Directive({ selector: 'bar-graph' })
export class BarGraph {
    graphWidth: number = 500;
    graphHeight: number = 400;
    divs: any;
    data: Array<number> = [10, 20, 30, 40, 60];
    constructor(
        el: ElementRef, renderer: Renderer) {
        // renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'yellow');

        //graph is a selection type
        var graph = d3.select(el.nativeElement);
        //append svg是為了透過attr改變view(CSS可連動),if style則無法透過css覆寫
        graph.append('svg')
            .attr('class', 'chart')
            .attr('width', this.graphWidth + 'px')
            .attr('height', this.graphHeight + 'px').selectAll('div')
            .data(this.data).enter().append('div');
    }
}