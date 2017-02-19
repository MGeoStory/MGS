import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { MapGraphService } from 'app/shared/map-graph.service';

let dropDataOfTime = [];
let thisComponent: DropdownList;
let dataFormatted: Array<Object>;

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
     * deal data for dropdwon list and Map/Graph
     */
    setDropData() {
        // resolve(sth) is needed, and .then() would work
        return new Promise(function (resolve, reject) {
            let parseTime = d3.timeParse("%Y/%m/%d");
            d3.csv('app/data/rawdata/simpleTest.csv', (data: Array<Object>) => {
                let listOfTime = d3.nest()
                    .key(d => { return d['發票年月'] })
                    .entries(data);
                listOfTime.forEach(d => {
                    dropDataOfTime.push(d.key);
                })
                dropDataOfTime.sort();

                data.forEach(d => {
                    //deal time and numbers format
                    // d['發票年月'] = parseTime(d['發票年月']);
                    d['平均客單價'] = +d['平均客單價'];
                    d['平均開立張數'] = +d['平均開立張數'];
                    d['平均開立金額'] = +d['平均開立金額'];
                });

                dataFormatted = data;
                // console.log(dropDataOfTime[0]);
                let defaultSelected = dropDataOfTime[0];
                // console.log(data);
                thisComponent.filteredData(defaultSelected,dataFormatted);
                resolve(data);
            });//END of d3.csv
        });//END of return
    }// END OF dropOfData

    /**
     * call after setDropData(), set the droplist value and text, and call filteredData() when menu on change
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
            let selected = d3.select(this).property('value');
            thisComponent.filteredData(selected, dataFormatted);
            // thisComponent.mgs.announceRefYear(select); 

        });
    }//END of setDropdownList

    /**
     * filter array values and annnoumceRefData
     */
    filteredData(selected: string, data: Array<Object>) {
        let dataFiltered = data.filter(column => {
            if (column['發票年月'] == selected && column['行業名稱'] == '便利商店') {
                return column;
            }
        })
        // console.log(dataFiltered);
        thisComponent.mgs.announceRefData(dataFiltered);
    }//END of filteredData
};// END of Class