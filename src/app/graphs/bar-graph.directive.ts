import { ElementRef, Input, Renderer, OnInit, OnDestroy, Component } from '@angular/core';
import { MapGraphService } from 'app/shared/map-graph.service';
import { Subscription } from 'rxjs/Subscription';
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
let userClickedInfo: string = '';
let subscription: Subscription;


@Component({
    selector: 'app-vertical-bar-graph',
    templateUrl: 'bar-graph.component.html',
    styleUrls: ['bar-graph.component.css']

})
export class BarGraph implements OnInit {
    private dataPath: string = 'app/data/bar.json';

    constructor(private el: ElementRef, private renderer: Renderer, private mgs: MapGraphService) {
        //passsing info to userClickedInfo
        subscription = mgs.refCountry$.subscribe(
            info => {
                userClickedInfo = info;
            });

        //append svg是為 了透過attr改變view(CSS可連動),if style則無法透過css覆寫
        //frame留白
        console.log(d3.select('graph') + '000');
        frame = d3.select(el.nativeElement).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);
        canvas = frame.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');;
    }

    ngOnInit(): void {
        this.setup();
        this.drawContent();
        // this.drawXAxis();
        // this.drawCircles();
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        subscription.unsubscribe();
    }

    setup(): void {
        xScale = d3.scaleBand().range([0, width]).paddingInner(0.1);
        yScale = d3.scaleLinear().range([0, height]);
        xAxis = d3.axisBottom(xScale);
    }

    drawContent(): void {
        d3.json(this.dataPath, function (data) {
            // console.log(JSON.stringify(data));
            // console.log(d3.max(data, (d) => d['value']));
            xScale.domain(data.map((d) => d['name']));
            yScale.domain([d3.max(data, (d) => d['value']), 0]);

            //bar-rect
            canvas.selectAll('rect').data(data).enter().append('rect')
                .attr('x', (d) => xScale(d['name']))
                .attr('y', (d) => yScale(d['value']))
                .attr('width', xScale.bandwidth())
                .attr('height', (d) => height - yScale(d['value']))
                // .attr("height", (d) => yScale(d['value']))
                .attr('fill', 'grey');

            //bar-value
            canvas.selectAll('text').data(data).enter().append('text')
                .attr('class', 'bar-value')
                .attr('x', (d) => xScale(d['name']) + xScale.bandwidth() / 2)
                .attr('y', (d) => yScale(d['value']) - 5)
                .attr('text-anchor', 'middle')
                .text((d) => d['value']);

            //不把axis抽成function是因為xAxis會用到xScale，這樣會有時間順序的問題
            //bar-name and axis
            canvas.append('g')
                .attr('class', 'xAxis')
                .attr('transform', `translate(0,${height})`)
                .call(xAxis);
            // console.log('drawContent end');

            d3.select('rect').attr('fill', 'red');
            // console.log(d3.select('rect').empty());

            d3.select('rect').on('mouseover', function () {
                console.log('mouserover');
                console.log(userClickedInfo);
            });
        });
    }

    //call xAxis沒有東西是life cycle的問題
    drawXAxis(): void {
        console.log('enter xAxis');
        canvas.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis);
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