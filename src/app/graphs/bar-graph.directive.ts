import { ElementRef, Input, Renderer, OnInit, OnDestroy, Component } from '@angular/core';
import { MapGraphService } from 'app/shared/map-graph.service';
import { Subscription } from 'rxjs/Subscription';
import * as d3 from 'd3';
import { GraphFrame } from 'app/shared/graph-frame';
import { GraphCanvas } from 'app/shared/graph-canvas';

let gc = new GraphCanvas();
let xAxis;
let yAxis;
let userClickedInfo: string = '';
let subscription: Subscription;
let thisComponment: BarGraph;

let testCanvas: d3.Selection<any, any, any, any>;
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
        // gc.createCanvas(el.nativeElement);

        // make sure testCanvas will be a d3.Selection<>, and the select.empty() can be read 
        testCanvas = gc.createCanvas(null);

    }//END OF constructor

    ngOnInit(): void {
        thisComponment = this;
        this.setup();
        subscription = thisComponment.mgs.refData.subscribe(
            data => {
                if (testCanvas.empty()) {
                    testCanvas = gc.createCanvas('#graph');
                    thisComponment.drawColumnGraph(data);
                } else {
                    gc.removeCanvas();
                    testCanvas = gc.createCanvas('#graph');
                    thisComponment.drawColumnGraph(data);
                }
            }//end of data=>
        )//end of Subscription
        // this.drawXAxis();
    }//END OF ngOnInit

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        subscription.unsubscribe();
    }//END OF ngOnDestroy

    setup(): void {
        xAxis = d3.axisBottom(gc.xScaleBand);
    }//END OF setup


    /**
     * draw bar graph by data passed from dropdown list
     */
    drawBarChart(data: Array<Object>): void {
        
    }// end of drawBarChart

    /**
    * draw column graph by data passed from dropdown list
    */
    drawColumnGraph(data: Array<Object>): void {
        // console.log(data);
        let extentOfData = d3.extent(data, (d) => {
            return d['平均客單價'];
        });
        // console.log(extentOfData);
        let dataForDraw = data.map(d => {
            return {
                name: d['縣市名稱'],
                value: d['平均客單價']
            }
        });
        let names = [];
        for (var i of dataForDraw) {
            names.push(i['name']);
        }

        // console.log(names);

        gc.xScaleBand.domain(names);
        gc.yScaleLinear.domain(extentOfData);

        testCanvas.selectAll('rect').data(dataForDraw).enter().append('rect')
            .attr('x', (d) => gc.xScaleBand(d['name']))
            .attr('y', (d) => gc.yScaleLinear(d['value']))
            .attr('width', gc.xScaleBand.bandwidth())
            .attr('height', (d) => gc.getFrameHeight() - gc.yScaleLinear(d['value']))
            // .attr("height", (d) => yScale(d['value']))
            .attr('fill', 'grey');

        testCanvas.selectAll('text').data(dataForDraw).enter().append('text')
            .attr('class', 'bar-value')
            .attr('x', (d) => gc.xScaleBand(d['name']) + gc.xScaleBand.bandwidth() / 2)
            .attr('y', (d) => gc.yScaleLinear(d['value']) - 5)
            .attr('text-anchor', 'middle')
            .text((d) => d['value']);
        // console.log('end of drawBarGraph');
    }// end of drawBarGraph

    //call xAxis沒有東西是life cycle的問題
    drawXAxis(): void {
        console.log('enter xAxis');
        testCanvas.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0,${gc.getFrameHeight()})`)
            .call(xAxis);
    }//END OF drawXAxis
}// END OF class