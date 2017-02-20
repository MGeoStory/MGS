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
        gc.createCanvas(el.nativeElement);

    }//END OF constructor

    ngOnInit(): void {
        thisComponment = this;
        this.setup();
        // this.drawContent();
        // this.drawGraph();
        subscription = thisComponment.mgs.refData.subscribe(
            data => {
                thisComponment.drawBarGraph(data);
            }
        )

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
    drawBarGraph(data: Array<Object>): void {
        console.log(data);
        let extentOfData = d3.extent(data, (d) => {
            return d['平均客單價'];
        });
        console.log(extentOfData);
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

        let a = gc.canvas.transition();
        gc.xScaleBand.domain(names);
        gc.yScaleLinear.domain(extentOfData);
        
        gc.canvas.selectAll('rect').data(dataForDraw).enter().append('rect')
            .attr('x', (d) => gc.xScaleBand(d['name']))
            .attr('y', (d) => gc.yScaleLinear(d['value']))
            .attr('width', gc.xScaleBand.bandwidth())
            .attr('height', (d) => gc.getFrameHeight() - gc.yScaleLinear(d['value']))
            // .attr("height", (d) => yScale(d['value']))
            .attr('fill', 'grey');
            
        gc.canvas.selectAll('text').data(dataForDraw).enter().append('text')
            .attr('class', 'bar-value')
            .attr('x', (d) => gc.xScaleBand(d['name']) + gc.xScaleBand.bandwidth() / 2)
            .attr('y', (d) => gc.yScaleLinear(d['value']) - 5)
            .attr('text-anchor', 'middle')
            .text((d) => d['value']);
            console.log('end of drawBarGraph');
    }// end of drawBarGraph

    drawGraph(): void {
        var parseTime = d3.timeParse("%Y/%m/%d");
        d3.csv('app/data/rawdata/simpleTest.csv', (data) => {
            //1. filter data
            var dataFiltered = data
                .filter(column => {
                    if (column['發票年月'] == '2013/1/1' && column['行業名稱'] == '便利商店') {
                        return column;
                    }
                });
            //2. adjust format
            dataFiltered.forEach(d => {
                //deal time and numbers format
                d['發票年月'] = parseTime(d['發票年月']);
                d['平均客單價'] = +d['平均客單價'];
                d['平均開立張數'] = +d['平均開立張數'];
                d['平均開立金額'] = +d['平均開立金額'];
            });

            //the paras in d3.extent() is array[], so build up a simple array
            var valuesOfData;

            valuesOfData = dataFiltered.map((d) => {
                return {
                    countryID: d['縣市代碼'],
                    value: d['平均客單價']
                }
            });
            var extentOfData = d3.extent(valuesOfData, function (d) {
                return d['value'];
            });
            // console.log(extentOfData);

            // console.log(dataFiltered);
            //3. nest data by縣市代碼
            var dataNested = d3.nest()
                .key(d => { return d['縣市代碼'] })
                .entries(dataFiltered);
            // console.log(dataNested);

            //4. map data(make data simplify) by what the map need
            var dataMapped = dataNested.map((d) => {
                // console.log(d.key);
                // console.log(d.values[0]['平均客單價']);
                return {
                    key: d.key,
                    value: d.values[0]['平均客單價']
                }
            });

            //5.using key to select value of data
            var dataDealed = d3.map(dataMapped, (d) => {
                return d.key;
            });
            // console.log(dataDealed.keys());
            var extentOfData = d3.extent(valuesOfData, function (d) {
                return d['value'];
            });
            gc.xScaleBand.domain(dataDealed.keys());
            gc.yScaleLinear.domain(extentOfData);
            gc.canvas.selectAll('rect').data(dataMapped).enter().append('rect')
                .attr('x', (d) => gc.xScaleBand(d['key']))
                .attr('y', (d) => gc.yScaleLinear(d['value']))
                .attr('width', gc.xScaleBand.bandwidth())
                .attr('height', (d) => gc.getFrameHeight() - gc.yScaleLinear(d['value']))
                // .attr("height", (d) => yScale(d['value']))
                .attr('fill', 'grey');

            gc.canvas.selectAll('text').data(dataMapped).enter().append('text')
                .attr('class', 'bar-value')
                .attr('x', (d) => gc.xScaleBand(d['key']) + gc.xScaleBand.bandwidth() / 2)
                .attr('y', (d) => gc.yScaleLinear(d['value']) - 5)
                .attr('text-anchor', 'middle')
                .text((d) => d['value']);

            gc.canvas.append('g')
                .attr('class', 'xAxis')
                .attr('transform', `translate(0,${gc.getFrameHeight()})`)
                .call(xAxis);
        });
    }

    /**
     * it's example.
     */
    drawContent(): void {
        d3.json(this.dataPath, function (data) {
            // console.log(JSON.stringify(data));
            // console.log(d3.max(data, (d) => d['value']));
            gc.xScaleBand.domain(data.map((d) => d['name']));
            gc.yScaleLinear.domain([d3.max(data, (d) => d['value']), 0]);

            //bar-rect
            gc.canvas.selectAll('rect').data(data).enter().append('rect')
                .attr('x', (d) => gc.xScaleBand(d['name']))
                .attr('y', (d) => gc.yScaleLinear(d['value']))
                .attr('width', gc.xScaleBand.bandwidth())
                .attr('height', (d) => gc.getFrameHeight() - gc.yScaleLinear(d['value']))
                // .attr("height", (d) => yScale(d['value']))
                .attr('fill', 'grey');

            //bar-value
            gc.canvas.selectAll('text').data(data).enter().append('text')
                .attr('class', 'bar-value')
                .attr('x', (d) => gc.xScaleBand(d['name']) + gc.xScaleBand.bandwidth() / 2)
                .attr('y', (d) => gc.yScaleLinear(d['value']) - 5)
                .attr('text-anchor', 'middle')
                .text((d) => d['value']);

            //不把axis抽成function是因為xAxis會用到xScale，這樣會有時間順序的問題
            //bar-name and axis
            gc.canvas.append('g')
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
        gc.canvas.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0,${gc.getFrameHeight()})`)
            .call(xAxis);
    }//END OF drawXAxis
}// END OF class