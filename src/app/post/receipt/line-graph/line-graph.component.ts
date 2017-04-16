import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MapGraphService } from 'app/shared/map-graph.service';
import { GraphFrame } from 'app/shared/graph-frame';
import { GraphCanvas } from 'app/shared/graph-canvas';
import { ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

let gc = new GraphCanvas();
let subscription: Subscription;
let canvas: d3.Selection<any, any, any, any>;

@Component({
    selector: 'post-receipt-line-graph',
    styleUrls: ['line-graph.component.css'],
    templateUrl: 'line-graph.component.html',
    encapsulation: ViewEncapsulation.None
})

export class LineGraphComponent implements OnInit {

    private RECIPT_DATA = 'src/app/data/rawdata/receipt_article_1.csv';
    private lineGraphTitle: string = "";
    private lineGraphInfo: string = "";
    constructor(private mgs: MapGraphService) {
        // canvas = gc.createCanvas(null);
    }

    ngOnInit() {

        this.mgs.refId.subscribe(
            id => {
                //more right margin for yAxis
                gc.setFrameMargin(-1, -1, -1, 50)
                canvas = gc.createCanvas('line-canvas', '#line-graph');
                this.drawLineGraph(id);
                this.lineGraphTitle = `${id}逐月平均消費金額（便利商店）:`;

                //scoll to line-graph
                // const element = document.querySelector('#test');
                // if (element) { element.scrollIntoView(element); }
                // let offsetTop = d3.select('#line-graph')['_groups'][0][0].offsetTop;
                // window.scrollTo(0, offsetTop - gc.getFrameHeight() / 3);
            }
        )
    }

    drawLineGraph(id: string): void {

        d3.csv(this.RECIPT_DATA, (data: Array<Object>) => {
            // console.log(data);

            //filter data
            let dataFiltered = data.filter(column => {
                if (column['縣市名稱'] == id) {
                    return column;
                }
            });
            // console.log(dataFiltered);

            //parse year and month to Date format 
            let timeParse = d3.timeParse("%Y/%m");
            //nesting data 
            let dataForDraw = dataFiltered.map(d => {
                let p = timeParse(d['發票年'] + "/" + d['發票月']);
                return {
                    name: d['縣市名稱'],
                    year: d['發票年'],
                    month: d['發票月'],
                    date: p,
                    value: +d['平均客單價']
                }
            });

            console.log(dataForDraw);

            gc.xScaleTime.domain(d3.extent(dataForDraw, (d) => {
                return d.date;
            }));

            gc.yScaleLinear.domain(d3.extent(dataForDraw, (d) => {
                return d.value;
            }));


            //draw x GridLine ,remove outer tick, remove text,remove top path, and change color of line
            let xGridLine = canvas.append('g')
                .attr('class', 'line-xGridLine')
                .call(gc.xAixsOfTimeOfGridLine().ticks(10).tickFormat(d3.timeFormat('%y/%d')));
            xGridLine.selectAll('text').remove();
            xGridLine.select('path').remove();
            xGridLine.selectAll('line').attr('stroke', 'grey');

            //draw x axis of line
            canvas.append('g')
                .attr('class', 'line-xAxis')
                .attr('transform', `translate(0,${gc.getFrameHeight()})`)
                .attr('stroke-width', '2px')
                .call(gc.xAxisOfTime().ticks(10).tickFormat(d3.timeFormat('%y/%m')));

            this.drawYAxisOfLinear(6);
            this.drawyGridLinear(6);

            //draw paths of line
            // console.log(gc.line(dataForDraw));
            this.drawPathOfLine(dataForDraw);

            //about lineGraphInfo
            let avg: number = this.getAvgValues(dataForDraw, 'value');
            let extent: number[] = d3.extent(dataForDraw, (d) => {
                return d.value;
            });

            let maxTime;
            let minTime;
            dataForDraw.forEach((d) => {
                if (d.value == extent[1]) {
                    maxTime = d.date;
                } else if (d.value == extent[0]) {
                    minTime = d.date;
                }
            })
            let tf = d3.timeFormat('%Y/%m')
            maxTime = tf(maxTime);
            minTime = tf(minTime);
            this.lineGraphInfo = `最大值：${extent[1]} (${maxTime}) ｜最小值：${extent[0]} (${minTime}) ｜平均值：${avg} `;
        });
    }//* drawLineGraph

    /**draw y axis of line
     * 
     */
    drawYAxisOfLinear(ticks: number) {
        canvas.append('g')
            .attr('class', 'line-yAxis')
            .attr('stroke-width', '2px')
            .call(gc.yAxisOfLinear().ticks(6));
    }

    /* 
    *draw y GridLine ,remove outer tick, remove text, and change color of line
    */
    drawyGridLinear(ticks: number) {
        let yGridLine = canvas.append('g')
            .attr('class', 'line-yGridLine')
            .call(gc.yAixsOfLinearOfGridLine().ticks(6))
        yGridLine.selectAll('text').remove();
        yGridLine.selectAll('line').attr('stroke', 'grey');
    }

    /**
     * draw paths of line (using gc.line)
     */
    drawPathOfLine(data: Array<Object>): void {
        canvas.append("path")
            .attr("class", "line-path")
            .attr("d", gc.line(data))
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', '2px');
    }

    /**
    * get average valuse from object array
    */
    getAvgValues(objs: Array<Object>, key: string): number {
        let sum: number = 0;
        let avg: number = 0;
        objs.forEach((d) => {
            sum += d[`${key}`];
        });
        avg = Math.round(sum / objs.length);
        return avg;
    }//* getAvgValues
}//* LineGraphComponent
