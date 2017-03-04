import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { MapGraphService } from 'app/shared/map-graph.service';

let dropDataOfTime: Array<string> = [];
let dropDataOfType: Array<string> = [];
let thisComponent: DropdownList;
let dataFormatted: Array<Object>;
let items: Array<String>;

@Component({
    selector: 'app-dropdown-list',
    templateUrl: 'dropdown-list.component.html',
    styleUrls: ['dropdown-list.component.css']
}) export class DropdownList implements OnInit {
    //ng variables
    public itemsOfTime: Array<string> = [];
    public activeOfTime: Array<string> = [];
    public itemsOfType: Array<string> = [];
    public activeOfType: Array<string> = [];

    public selecedOfTime: string;
    public selectedOfType: string;

    title = 'data sharing';
    brief = 'infomation about Taiwan.';
    constructor(private mgs: MapGraphService) {
    }

    ngOnInit() {
        thisComponent = this;
        // this.setDropData().then(this.setDropdownList);
        this.setDropData();
    }// END OF ngOnInit

    /**
     * get ng-select info
     */
    timeSelected(value: any): void {
        this.selecedOfTime = value.text;
        this.getSelectedCondition();
    }

    /**
     * get ng-select info
     */
    typeSelected(value: any): void {
        this.selectedOfType = value.text;
        this.getSelectedCondition();
    }

    getTimeSelected(): string {
        return this.selecedOfTime;
    }

    getTypeSelected(): string {
        return this.selectedOfType;
    }

    /**
     * deal the condition about user's select
     */
    getSelectedCondition() {
        let time = this.getTimeSelected();
        let type = this.getTypeSelected();
        console.log(time+""+type);
        thisComponent.filterData(time, type, dataFormatted);
    }

    /**
     * deal data for dropdwon list and Map/Graph
     */
    setDropData() {
        // resolve(sth) is needed, and .then() would work
        return new Promise(function (resolve, reject) {
            //https://github.com/d3/d3-time-format
            let parseTime = d3.timeParse("%Y/%m/%d");
            // data manipulation: http://learnjsdata.com/group_data.html
            d3.csv('app/data/rawdata/simpleTest.csv', (data: Array<Object>) => {

                let listOfTime = d3.nest()
                    .key(d => { return d['發票年月'] })
                    .entries(data);
                listOfTime.forEach(d => {
                    dropDataOfTime.push(d.key);
                })
                dropDataOfTime.sort();

                let listOfType = d3.nest()
                    .key(d => { return d['行業名稱'] })
                    .entries(data);
                listOfType.forEach(d => {
                    dropDataOfType.push(d.key);
                })
                dropDataOfType.sort();

                data.forEach(d => {
                    //deal time and numbers format
                    // d['發票年月'] = parseTime(d['發票年月']);
                    d['平均客單價'] = +d['平均客單價'];
                    d['平均開立張數'] = +d['平均開立張數'];
                    d['平均開立金額'] = +d['平均開立金額'];
                });

                dataFormatted = data;
                // console.log(dropDataOfTime[0]);
                let defaultSelectedOfTime = dropDataOfTime[0];
                let defaultSelectedOfType = dropDataOfType[0];
                // console.log(data);

                //set the values of ng-select
                thisComponent.activeOfTime = [dropDataOfTime[0]];
                thisComponent.itemsOfTime = dropDataOfTime;
                thisComponent.selecedOfTime = dropDataOfTime[0];
                
                thisComponent.activeOfType = [dropDataOfType[0]];
                thisComponent.itemsOfType = dropDataOfType;
                thisComponent.selectedOfType =dropDataOfType[0];
                
                thisComponent.filterData(defaultSelectedOfTime, defaultSelectedOfType, dataFormatted);
                resolve(data);
            });//END of d3.csv
        });//END of return
    }// END OF dropOfData

    /**
     * filter array values and annnoumceRefData
     */
    filterData(timeSelected: string, typeSelected: string, data: Array<Object>) {
        let dataFiltered = data.filter(column => {
            if (column['發票年月'] == timeSelected && column['行業名稱'] == typeSelected) {
                return column;
            }
        })
        console.log(dataFiltered);
        thisComponent.mgs.announceRefData(dataFiltered);
    }//END of filteredData
};// END of Class