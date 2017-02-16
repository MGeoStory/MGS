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

        
        var t = this.readFile().then(function (res) {
            console.log(res);
        })
        console.log(t);


    }// END OF ngOnInit

    /**
     * 
     */

    readFile() {
        return new Promise(function (resolve, reject) {
            d3.csv('app/data/rawdata/simpleTest.csv', (data: Array<Object>) => {
                result = data.filter(column => {
                    if (column['發票年月'] == '2013/01/01' || column['行業名稱'] == '便利商店') {
                        return column;
                    }
                });
                resolve(result);
            });
        });
    }

    filterData(): void {
        d3.csv('app/data/rawdata/simpleTest.csv', (data: Array<Object>) => {
            result = data.filter(column => {
                if (column['發票年月'] == '2013/01/01' || column['行業名稱'] == '便利商店') {
                    return column;
                }
            });
        });
    }
};