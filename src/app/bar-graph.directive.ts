import { Directive, ElementRef, Input, Renderer, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { JsonService } from './json.service';

@Directive({ selector: 'bar-graph' })
export class BarGraph implements OnInit {
    graphWidth: number = 500;
    graphHeight: number = 400;
    graph: any;
    // data: Array<number> = [10, 20, 30, 40, 60];
    public jData;
    constructor(
        private el: ElementRef, private renderer: Renderer, private js: JsonService) {
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
        graph.append('svg').append('circle')
            .attr('cx', 5)
            .attr('cy', 5)
            .attr('r', 5);
        d3.json('app/data/circle.json', function (d) {
            console.log(d);
        }
        );
    }

    ngOnInit() {
        this.getJson('app/data/circle.json');
        // d3.json(this.jData, function (d) {
        console.log('test: ' + this.jData);

        // });

        // d3.json('app/data/circle.json', function (d) {
        //     console.log(d);
        // }
        // );
        d3.csv('app/data/test.csv', function (d) {
            console.log(d);
        }
        );

    }

    private getJson(path: string) {
        this.js.getJsonData(path).subscribe(
            data => {
                this.jData = data;
            },
            err => console.error(err),
            () => console.log('got json data')
        )
    }

}