import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { MapGraphService } from 'app/shared/map-graph.service';

let outResult: Array<Object>;
let dropDataOfTime = [];
let thisComponent: DropdownList;
@Component({
    selector: 'app-dropdown-list',
    templateUrl: 'dropdown-list.component.html',
    styleUrls: ['dropdown-list.component.css']
}) export class DropdownList implements OnInit {
    title = 'data sharing';
    brief = 'infomation about Taiwan.';

    constructor(private mgs: MapGraphService) {
    }

    ngOnInit() {
        thisComponent = this;
        this.setDropData().then(this.setDropdownList);
    }// END OF ngOnInit

    /**
     * call after setDropData(), set the droplist value and text
     */
    setDropdownList() {
        //select id => '#+id'
        var dropDown = d3.select('#select_table').append('select')
            .attr('name', 'listOfTime');

        // html select->options
        var options = dropDown.selectAll('option')
            .data(dropDataOfTime)
            .enter()
            .append('option');
        options
            .text((d, i) => { return dropDataOfTime[i]; })
            .attr('value', (d, i) => { return dropDataOfTime[i]; });

        dropDown.on('change', function () {
            console.log(d3.select(this).property('value'));
            var select = d3.select(this).property('value');
            thisComponent.mgs.announceRefYear(select);
        });

    }//END of setDropdownList

    /**
     * deal data od dropdwon list
     */
    setDropData() {
        // resolve(sth) is needed, and then will
        return new Promise(function (resolve, reject) {
            d3.csv('app/data/rawdata/simpleTest.csv', (data: Array<Object>) => {
                var listOfTime = d3.nest()
                    .key(d => { return d['行業名稱'] })
                    .entries(data);
                listOfTime.forEach(d => {
                    dropDataOfTime.push(d.key);
                })
                resolve(data);
            });
        });
    }// END OF dropOfData

    /**
     * filter and parse array values 
     */
    dealedData(): Promise<Array<Object>> {
        return new Promise(function (resolve, reject) {
            var parseTime = d3.timeParse("%Y/%m/%d");
            d3.csv('app/data/rawdata/simpleTest.csv', (data: Array<Object>) => {

                data.filter(column => {
                    if (column['發票年月'] == '2013/01/01' || column['行業名稱'] == '便利商店') {
                        return column;
                    }
                });

                data.forEach(d => {
                    //deal time and numbers format
                    d['發票年月'] = parseTime(d['發票年月']);
                    d['平均客單價'] = +d['平均客單價'];
                    d['平均開立張數'] = +d['平均開立張數'];
                    d['平均開立金額'] = +d['平均開立金額'];
                });
                outResult = data;
                resolve(outResult);
            });// END OF d3.csv
        });// END OF return
    }// END OF dealedData
};