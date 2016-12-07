import { Directive, ElementRef, Input, Renderer, OnInit } from '@angular/core';
import * as d3 from 'd3';

let frame;
let canvas;
let width = 500;
let height = 300;
let margin = { top: 20, right: 20, bottom: 20, left: 20 };
let xScale;
let yScale;
let xAxis;
let yAxis;

@Directive({ selector: 'vertical-bar-graph' })
export class BarGraph implements OnInit {

    private dataPath: string = 'app/data/bar.json';

    constructor(private el: ElementRef, private renderer: Renderer) {
        //append svg是為 了透過attr改變view(CSS可連動),if style則無法透過css覆寫
        //frame留白
        frame = d3.select(el.nativeElement).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);
        canvas = frame.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');;
    }

    ngOnInit(): void {
        this.setup();
        this.buildContent();
        this.drawCircles();
    }

    setup(): void {
        xScale = d3.scaleBand().range([0, width]);
        yScale = d3.scaleLinear().range([0, height]);
    }

    buildContent(): void {
        d3.json(this.dataPath, function (data) {
            console.log(JSON.stringify(data));
            // console.log(d3.max(data, (d) => d['value']));
            xScale.domain(data.map((d) => d['name']));
            yScale.domain([d3.max(data, (d) => d['value']), 0]);

            canvas.selectAll('rect').data(data).enter().append('rect')
                .attr('x', (d) => xScale(d['name']))
                .attr('y', (d) => yScale(d['value']))
                .attr('width', xScale.bandwidth())
                .attr('height', (d) => height - yScale(d['value']))
                // .attr("height", (d) => yScale(d['value']))
                .attr('fill', 'grey');

        });
    }

    drawCircles(): void {
        d3.json('app/data/circle.json', function (data) {
            canvas.selectAll('circle').data(data).enter().append('circle')
                .attr('cx', (d) => d['x_axis'])
                .attr('cy', (d) => d['y_axis'])
                .attr('r', (d) => d['radius']);
        }
        );
    }
}