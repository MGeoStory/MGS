import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MapGraphService } from 'app/shared/map-graph.service';
import { GraphFrame } from 'app/shared/graph-frame';
import { GraphCanvas } from 'app/shared/graph-canvas';
import * as d3 from 'd3';

let gc = new GraphCanvas();
let subscription: Subscription;
let canvas: d3.Selection<any, any, any, any>;

@Component({
    selector: 'post-receipt-line-graph',
    styleUrls: ['line-graph.component.css'],
    templateUrl: 'line-graph.component.html'
})

export class LineGraphComponent implements OnInit {

    private RECIPT_DATA = 'src/app/data/rawdata/receipt_article_1.csv';

    constructor(private mgs: MapGraphService) {
        // canvas = gc.createCanvas(null);
    }

    ngOnInit() {

        this.mgs.refId.subscribe(
            id => {
                //more right margin for yAxis
                gc.setFrameMargin(-1,-1,-1,50)
                canvas = gc.createCanvas('line-canvas', '#line-graph');
                this.drawLineGraph(id);
                console.log(id);
            }
        )
    }


    drawLineGraph(id: string) {
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


            // dataForDraw.forEach(d => {
            //     d.date = timeParse(d.year + "/" + d.month);
            // })

            console.log(dataForDraw);

            gc.xScaleTime.domain(d3.extent(dataForDraw, (d) => {
                return d.date;
            }))

            gc.yScaleLinear.domain(d3.extent(dataForDraw, (d) => {
                return d.value;
            }))

            //draw y axis of line
            canvas.append('g')
                .attr('class','line-yAxis')
                .call(d3.axisLeft(gc.yScaleLinear).ticks(6));;
            
            //draw x axis of line
            canvas.append('g')
            .attr('class','line-xAxis')
            .attr('transform',`translate(0,${gc.getFrameHeight()})`)
            .call(d3.axisBottom(gc.xScaleTime).ticks(5));

            //draw paths of line
            console.log(gc.line(dataForDraw));
            canvas.append("path")
                .attr("class", "line-path")
                .attr("d", gc.line(dataForDraw))
                .attr('fill', 'none')
                .attr('stroke', 'blue');
        });
    }//* drawLineGraph
}
