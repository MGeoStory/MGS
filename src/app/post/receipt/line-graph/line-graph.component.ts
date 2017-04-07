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
        canvas = gc.createCanvas(null);
    }

    ngOnInit() {
        this.mgs.refId.subscribe(
            id => {
                canvas = gc.createCanvas('#line-graph');
                this.drawLineGraph(id);
            }
        )
    }


    drawLineGraph(id: string) {
        d3.csv(this.RECIPT_DATA, (data: Array<Object>) => {
            // console.log(data);

            let dataFiltered = data.filter(column => {
                if (column['縣市名稱'] == id) {
                    return column;
                }
            });
            // console.log(dataFiltered);

            let dataForDraw = dataFiltered.map(d => {
                return {
                    name: d['縣市名稱'],
                    year: d['發票年'],
                    month: d['發票月'],
                    value: +d['平均客單價']
                }
            });
            console.log(dataForDraw);

            
        });
    }//* drawLineGraph
}