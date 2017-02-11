import { ElementRef, Input, Renderer, OnInit, OnDestroy, Component } from '@angular/core';
import { MapGraphService } from 'app/shared/map-graph.service';
import { Subscription } from 'rxjs/Subscription';
import * as d3 from 'd3';
import { GraphFrame } from 'app/shared/graph-frame';
import { GraphCanvas } from 'app/shared/graph-canvas';

// let gf = new GraphFrame();
let gc = new GraphCanvas();
let canvas;
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
        // gc.setFrameHeight(11);
        // gc.setFrameWidth(11);
        // gc.setFrameMargin{11,11,1,1};
        console.log(gc.getFrameHeight());
        console.log(gc.getFrameWidth());
        // console.log(gc.getFrameMargin()['top']);

        canvas = gc.addFrame(el.nativeElement).append('g')
            .attr('transform', 'translate(' + gc.getFrameMargin()['left'] + ',' + gc.getFrameMargin()['top'] + ')');;
    }//END OF constructor

    ngOnInit(): void {
        this.setup();
        this.drawContent();
        // this.drawXAxis();
        // this.drawCircles();
    }//END OF ngOnInit

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        subscription.unsubscribe();
    }//END OF ngOnDestroy

    setup(): void {
        xScale = d3.scaleBand().range([0, gc.getFrameWidth()]).paddingInner(0.1);
        yScale = d3.scaleLinear().range([0, gc.getFrameHeight()]);
        xAxis = d3.axisBottom(xScale);
    }//END OF setup



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
                .attr('height', (d) => gc.getFrameHeight() - yScale(d['value']))
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
                .attr('transform', `translate(0,${gc.getFrameHeight()})`)
                .call(xAxis);
            // console.log('drawContent end');

            d3.select('rect').attr('fill', 'red');
            // console.log(d3.select('rect').empty());

            d3.select('rect').on('click', function () {
                console.log('clicked');
                console.log(userClickedInfo);
            });
        });
    }//END OF drawContent

    //call xAxis沒有東西是life cycle的問題
    drawXAxis(): void {
        console.log('enter xAxis');
        canvas.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0,${gc.getFrameHeight()})`)
            .call(xAxis);
    }//END OF drawXAxis
}// END OF class