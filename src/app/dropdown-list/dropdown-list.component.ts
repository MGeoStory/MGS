import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

var result: Array<Object>;

@Component({
    selector: 'app-dropdown-list',
    templateUrl: 'dropdown-list.component.html',
    styleUrls: ['dropdown-list.component.css']
}) export class DropdownList implements OnInit {
    title = 'data sharing';
    brief = 'infomation about Taiwan.';

    ngOnInit() {

        this.dealedData().then(function (res) {
            var listOfTime;
            listOfTime = res.map(function (data) {
                // console.log(data);
                return {
                    time: data['發票年月'],
                }
            });
            console.log(listOfTime);

            var data1 = [ {'value': 10}, {'value': 11}, {'value': 12} ];
            console.log(data1);
            var dropDown = d3.select('#select_table').append('select')
                .attr('name','listOfTime');
            var options = dropDown.selectAll("option")
                .data(listOfTime) 
                .enter()
                .append("option");
            options.text(function(d){
                console.log(d);
                return 11;
            }).attr('value',11);
            
        });

        var t = this.dealedData().then(function (res) {
        });
    }// END OF ngOnInit


    /**
     * filter and parse data values
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

                result = data;

                resolve(result);
            });// END OF d3.csv
        });// END OF return
    }// END OF dealedData
};