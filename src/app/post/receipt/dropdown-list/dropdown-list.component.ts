import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { MapGraphService } from 'app/shared/map-graph.service';

let dropDataOfTime: Array<string> = [];
let dropDataOfType: Array<string> = [];
let thisComponent: DropdownListComponent;
let dataFormatted: Array<Object>;
let items: Array<String>;

@Component({
    selector: 'post-receipt-dropdown-list',
    templateUrl: 'dropdown-list.component.html',
    styleUrls: ['dropdown-list.component.css']
}) export class DropdownListComponent implements OnInit {
    public yearValue: string = '2013';
    public monthValue: string = '1';
    public minYear: number = 2013;
    public maxYear: number = 2016;
    private RECIPT_DATA = 'src/app/data/rawdata/receipt_article_1.csv';
    public yearConfig: any = {
        behaviour: 'drag',
        start: [this.minYear, this.maxYear],
        step: 1,
        pageSteps: this.maxYear - this.minYear,
        range: {
            min: this.minYear,
            max: this.maxYear
        },
        pips: {
            mode: 'count',
            //small xias
            density: 100,
            //number of values
            values: this.maxYear - this.minYear + 1,
            stepped: true
        }
    };
    public monthConfig: any = {
        behaviour: 'drag',
        start: [1, 12],
        step: 1,
        pageSteps: 1,
        range: {
            min: 1,
            max: 12
        },
        pips: {
            mode: 'count',
            //small xias
            density: 100,
            //number of values
            values: 13,
            stepped: true
        }
    };


    //ng variables
    public selectedYear: string;
    public selectedMonth: string;


    title = '南北便利商店角色大不同！';
    brief = '台灣電子發票消費地圖';
    constructor(private mgs: MapGraphService) {
    }

    ngOnInit() {
        thisComponent = this;
        this.setDropData();
    }// END OF ngOnInit

    onChangeYear(e) {
        this.selectedYear = e;
        this.getSelectedCondition();
    }

    onChangeMonth(e) {
        this.selectedMonth = e;
        console.log(this.selectedMonth);
        this.getSelectedCondition();
    }

    getYearSelected(): string {
        return this.selectedYear;
    }

    getMonthSelected(): string {
        return this.selectedMonth;
    }
    /**
     * deal the condition about user's select
     */
    getSelectedCondition() {
        let year = this.getYearSelected();
        let month = this.getMonthSelected();

        thisComponent.filterData(year, month, dataFormatted);
    }

    /**
     * deal data for dropdwon list and Map/Graph
     */
    setDropData() {
        // resolve(sth) is needed, and .then() would work
        return new Promise(function (resolve, reject) {
            // data manipulation: http://learnjsdata.com/group_data.html
            d3.csv(thisComponent.RECIPT_DATA, (data: Array<Object>) => {
                data.forEach(d => {
                    //deal time and numbers format
                    // d['發票年月'] = parseTime(d['發票年月']);
                    d['平均客單價'] = +d['平均客單價'];
                    d['平均開立張數'] = +d['平均開立張數'];
                    d['平均開立金額'] = +d['平均開立金額'];
                });

                dataFormatted = data;
                thisComponent.filterData(thisComponent.yearValue, thisComponent.monthValue, dataFormatted);
                resolve(data);
            });//END of d3.csv
        });//END of return
    }// END OF dropOfData

    /**
     * filter array values and annnoumceRefData
     */
    filterData(timeSelected: string, typeSelected: string, data: Array<Object>) {
        console.log('filterData');
        let dataFiltered = data.filter(column => {
            if (column['發票年'] == timeSelected && column['發票月'] == typeSelected) {
                return column;
            }
        })
        console.log(dataFiltered);
        thisComponent.mgs.announceRefData(dataFiltered);
    }//END of filteredData
};// END of Class