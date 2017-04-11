import { Input, OnInit, OnDestroy, Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MapGraphService } from 'app/shared/map-graph.service';
import { GraphFrame } from 'app/shared/graph-frame';
import { GraphCanvas } from 'app/shared/graph-canvas';
import * as d3 from 'd3';


let gc = new GraphCanvas();
// let subscription: Subscription;
//decare outside of class =>dont use this. to appoint variable
let canvas: d3.Selection<any, any, any, any>;

@Component({
    selector: 'post-receipt-bar-graph',
    templateUrl: 'bar-graph.component.html',
    styleUrls: ['bar-graph.component.css'],
})
export class BarGraph implements OnInit {
    private graphTitle: string = "各縣市平均消費金額(2013/1):";

    constructor(private mgs: MapGraphService) {
    }//END OF constructor

    ngOnInit(): void {
        this.mgs.refTime.subscribe(
            time => {
                this.graphTitle = `各縣市平均消費金額(${time[0]}/${time[1]}):`;
            }
        )

        this.mgs.refData.subscribe(
            data => {
                // remove line-canvas when user select new time record
                if (!d3.select('#line-canvas').empty()) {
                    d3.select('#line-canvas').remove();
                }
                canvas = gc.createCanvas('bar-canvas', '#bar-graph');
                this.drawColumnGraph(data);
            }//end of data=>
        );//end of Subscription

        // the previous clicked id on map from user
        let preUserClicked: string;

        //color the bar which user clicked on map
        this.mgs.refId.subscribe(
            userClicked => {
                //reset the color
                d3.select(`.${preUserClicked}`).style('fill', 'skyblue');

                //save the info of user clicked
                preUserClicked = userClicked;

                //set new color
                d3.select(`.${userClicked}`).style('fill', 'blue');
            }
        );
    }//END OF ngOnInit

    // ngOnDestroy() {
    //     // prevent memory leak when component destroyed
    //     subscription.unsubscribe();
    // }//END OF ngOnDestroy

    /**
    * draw column graph by data passed from dropdown list
    */
    drawColumnGraph(data: Array<Object>): void {
        // maxOfData is used to Scale graph
        let maxOfData = d3.max(data, (d) => {
            return d['平均客單價'];
        })

        //data reduction
        let dataForDraw = data.map(d => {
            return {
                name: d['縣市名稱'],
                value: d['平均客單價']
            }
        });

        //sort data by '平均客單價'
        dataForDraw.sort(function (x, y) {
            return d3.descending(x.value, y.value);
        });

        //set the name of band
        let names = [];
        for (var i of dataForDraw) {
            names.push(i['name']);
        };

        //set the value of xAxis
        gc.xScaleBand.domain(names);

        gc.yScaleLinear.domain([0, maxOfData]);

        //append bar chart
        canvas.selectAll('rect').data(dataForDraw).enter().append('rect')
            .attr('x', (d) => gc.xScaleBand(d['name']))
            .attr('y', (d) => gc.yScaleLinear(d['value']))
            .attr('class', (d) => (d['name']))
            .attr('width', gc.xScaleBand.bandwidth())
            .attr('height', (d) => gc.getFrameHeight() - gc.yScaleLinear(d['value']))
            .attr('fill', 'skyblue');

        //append values of bar
        canvas.selectAll('text').data(dataForDraw).enter().append('text')
            .attr('class', 'bar-value')
            .attr('x', (d) => gc.xScaleBand(d['name']) + gc.xScaleBand.bandwidth() / 2)
            .attr('y', (d) => gc.yScaleLinear(d['value']) - 5)
            .attr('text-anchor', 'middle')
            .text((d) => d['value'])
            //0.9em will equal 0.9 x the parent font-size
            .style('font-size', '1.2rem')
            .style('fill', (d, i) => {
                if (i % 2 == 0) {
                    return 'black';
                } else {
                    return 'DimGrey';
                }
            });
        // console.log('end of drawBarGraph');

        //the text of domain name from gc.scaleBand.domain()
        let textOfAaxis = canvas.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0,${gc.getFrameHeight()})`)
            .call(gc.xAxisOfBand())
            .selectAll('text')
            .style('fill', (d, i) => {
                if (i % 2 == 0) {
                    return 'black';
                } else {
                    return 'DimGrey';
                }
            });

        this.drawAvgLine(dataForDraw);

        //make text more reabable
        if (names.length > 10) {
            textOfAaxis.attr('transform', 'rotate(45)')
                .attr('x', 20)
                .style('font-size', '1.2rem');
        } else {
            textOfAaxis.attr('y', 10).attr('font-size', '1.5rem');
        };

    }// end of drawBarGraph

    /*
    * drwa average line and the info text
    */
    drawAvgLine(dataForDraw: Array<Object>) {
        console.log(dataForDraw);
        let sum: number = 0;
        let avg: number = 0;
        dataForDraw.forEach((d) => {
            sum += d['value'];
        });
        avg = Math.round(sum / dataForDraw.length);

        //avg line
        canvas.append('line')
            .style('stroke', 'red')
            .style('stroke-dasharray', ('3,3'))
            .attr('x1', 0)
            .attr('y1', gc.yScaleLinear(avg))
            .attr('x2', gc.getFrameWidth())
            .attr('y2', gc.yScaleLinear(avg));

        //info of avg line
        canvas.append('text')
            .attr('x', gc.getFrameWidth())
            .attr('y', gc.yScaleLinear(avg) - 3)
            .attr('text-anchor', 'end')
            .style('fill', 'red')
            .text(`平均值:${avg}元`);

    }
}// END OF class