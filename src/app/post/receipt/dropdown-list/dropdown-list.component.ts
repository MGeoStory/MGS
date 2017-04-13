import { Component, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { MapGraphService } from 'app/shared/map-graph.service';
import { ModalDirective } from 'ng2-bootstrap/modal';

let thisComponent: DropdownListComponent;
let dataFormatted: Array<Object>;

@Component({
    selector: 'post-receipt-dropdown-list',
    templateUrl: 'dropdown-list.component.html',
    styleUrls: ['dropdown-list.component.css']
}) export class DropdownListComponent implements OnInit {
    @ViewChild('childModal') public childModal: ModalDirective;

    title = '南北便利商店角色大不同！';
    brief = '2017/03/29- MoGeoStory';

    public yearValue: string = '2013';
    public monthValue: string = '1';
    public minYear: number = 2013;
    public maxYear: number = 2016;

    //ng variables
    public selectedYear: string;
    public selectedMonth: string;

    private RECIPT_DATA = 'src/app/data/rawdata/receipt_article_1.csv';
    public yearConfig: any = {
        behaviour: 'tap',
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
        behaviour: 'tap',
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

    constructor(private mgs: MapGraphService) {
    }

    ngOnInit() {
        thisComponent = this;
        this.setDropData();
        
        //scroll to top whn user entire page
        window.scroll(0,0);
    }// END OF ngOnInit

    public showChildModal(): void {
        this.childModal.show();
    }

    public hideChildModal(): void {
        this.childModal.hide();
    }

    /**
     * get the user select
     * @param e 
     */
    onChangeYear(userSelected: string) {
        this.selectedYear = userSelected;
        this.getSelectedCondition();
    }

    /**
     * get the user select
     * @param e 
     */
    onChangeMonth(userSelected: string) {
        this.selectedMonth = userSelected;
        this.getSelectedCondition();
    }

    /**
     * deal the condition about user's select
     */
    getSelectedCondition() {
        let year: string = "";
        let month: string = "";
        year = this.yearValue;
        month = this.monthValue;
        // console.log(year + "," + month);
        let refTime: Array<string> = [];
        refTime.push(year);
        refTime.push(month);
        console.log(refTime);
        //announceRefTime to title of bar-graph
        this.mgs.announceRefTime(refTime);
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
        // console.log('filterData');
        let dataFiltered = data.filter(column => {
            if (column['發票年'] == timeSelected && column['發票月'] == typeSelected) {
                return column;
            }
        })
        if (dataFiltered.length == 0) {
            console.log("no data");

            //show the modal
            this.showChildModal();

            dataFiltered = data.filter(column => {
                if (column['發票年'] == '2016' && column['發票月'] == '8') {
                    return column;
                }
            });

            thisComponent.mgs.announceRefData(dataFiltered);

            //set the value to the latest data
            this.yearValue = '2016';
            this.monthValue = '8';

        } else {
            thisComponent.mgs.announceRefData(dataFiltered);
        }
    }//END of filteredData
};// END of Class