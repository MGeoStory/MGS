import { Directive, ElementRef, Input, Renderer, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Directive({ selector: 'vertical-bar-graph' })
export class BarGraph implements OnInit {
    private frame;
    private canvas;
    private width = 400;
    private height = 200;
    private margin = { top: 20, right: 20, bottom: 40, left: 40 };

    private xScale;
    private yScale;
    private xAxis;
    private yAxis;
    private dataPath: string = 'app/data/circle.json';

    constructor(private el: ElementRef, private renderer: Renderer) {
        //append svg是為 了透過attr改變view(CSS可連動),if style則無法透過css覆寫
        this.frame = d3.select(el.nativeElement).append('svg')
            //frame留白
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);
        this.canvas = this.frame.append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');;
        // .attr('width', this.width - this.margin.right - this.margin.left)
        // .attr('height', this.height - this.margin.top - this.margin.bottom);
    }

    ngOnInit(): void {
        this.setup();
        this.buildGraph();
        // this.drawCircles(this.canvas);
    }

    setup(): void {
        this.xScale = d3.scaleOrdinal().range([0, this.width]);
        this.yScale = d3.scaleLinear().range([this.height, 0]);
    }

    buildGraph(): void {

    }

    drawCircles(svg): void {
        d3.json(this.dataPath, function (data) {
            svg.selectAll('circle').data(data).enter().append('circle')
                .attr('cx', (d) => d['x_axis'])
                .attr('cy', (d) => d['y_axis'])
                .attr('r', (d) => d['radius']);
        }
        );
    }
}