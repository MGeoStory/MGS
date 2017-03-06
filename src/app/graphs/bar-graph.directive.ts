import { ElementRef, Input, Renderer, OnInit, OnDestroy, Component } from '@angular/core';
import { MapGraphService } from 'app/shared/map-graph.service';
import { Subscription } from 'rxjs/Subscription';
import * as d3 from 'd3';
import { GraphFrame } from 'app/shared/graph-frame';
import { GraphCanvas } from 'app/shared/graph-canvas';
import { citiesOfTaiwan } from 'app/shared/cities-tw';

let ct = new citiesOfTaiwan();
let gc = new GraphCanvas();
let subscription: Subscription;
let canvas: d3.Selection<any, any, any, any>;

@Component({
    selector: 'app-vertical-bar-graph',
    templateUrl: 'bar-graph.component.html',
    styleUrls: ['bar-graph.component.css'],
})
export class BarGraph implements OnInit {
    private dataPath: string = 'app/data/bar.json';


    constructor(private el: ElementRef, private renderer: Renderer, private mgs: MapGraphService) {
        // make sure testCanvas will be a d3.Selection<>, and the select.empty() can be read 
        canvas = gc.createCanvas(null);
    }//END OF constructor

    ngOnInit(): void {
        subscription = this.mgs.refData.subscribe(
            data => {
                if (canvas.empty()) {
                    canvas = gc.createCanvas('#graph');
                    this.drawColumnGraph(data);
                } else {
                    gc.removeCanvas();
                    canvas = gc.createCanvas('#graph');
                    this.drawColumnGraph(data);
                }
            }//end of data=>
        )//end of Subscription
        // this.drawXAxis();
    }//END OF ngOnInit

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        subscription.unsubscribe();
    }//END OF ngOnDestroy

    /**
     * draw bar graph by data passed from dropdown list
     */
    drawBarChart(data: Array<Object>): void {
        let dataOfCities = ct.getCitiesOfTaiwan();
        //pass value of data to the dataForGraph
        data.forEach((od) => {
            dataOfCities.forEach((nd) => {
                if (od['縣市代碼'] == nd['id']) {
                    nd['value'] = od['平均客單價'];
                }
            });
        });
        console.log(dataOfCities);
    }// end of drawBarChart

    /**
    * draw column graph by data passed from dropdown list
    */
    drawColumnGraph(data: Array<Object>): void {

        // maxOfData is used to Scale graph
        let maxOfData = d3.max(data, (d) => {
            return d['平均客單價'];
        })



        // console.log(extentOfData);
        let dataForDraw = data.map(d => {
            return {
                name: d['縣市名稱'],
                value: d['平均客單價']
            }
        });

        dataForDraw.sort(function (x, y) {
            return d3.descending(x.value, y.value);
        })

        let names = [];
        for (var i of dataForDraw) {
            names.push(i['name']);
        }
        // console.log(names);

        //set the value of xAxis
        gc.xScaleBand.domain(names);

        gc.yScaleLinear.domain([0, maxOfData]);

        canvas.selectAll('rect').data(dataForDraw).enter().append('rect')
            .attr('x', (d) => gc.xScaleBand(d['name']))
            .attr('y', (d) => gc.yScaleLinear(d['value']))
            .attr('width', gc.xScaleBand.bandwidth())
            .attr('height', (d) => gc.getFrameHeight() - gc.yScaleLinear(d['value']))
            // .attr("height", (d) => yScale(d['value']))
            .attr('fill', 'skyblue');

        canvas.selectAll('text').data(dataForDraw).enter().append('text')
            .attr('class', 'bar-value')
            .attr('x', (d) => gc.xScaleBand(d['name']) + gc.xScaleBand.bandwidth() / 2)
            .attr('y', (d) => gc.yScaleLinear(d['value']) - 5)
            .attr('text-anchor', 'middle')
            .text((d) => d['value']);
        // console.log('end of drawBarGraph');

        //text from gc.scaleBand.domain()
        let textOfAaxis = canvas.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0,${gc.getFrameHeight()})`)
            .call(gc.xAxisOfColumn)
            .selectAll('text');

        if (names.length > 10) {
            textOfAaxis.attr('transform', 'rotate(45)')
                .attr('x', 20)
                .attr('font-size','12px');
        } else {
            textOfAaxis.attr('y',10).attr('font-size','14px');
        };


    }// end of drawBarGraph
}// END OF class