import { Injectable } from '@angular/core';
import { Http, Response, HttpModule } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class DemoService {
    constructor(private http: Http) {
        console.log("DemoService-constructor");
    }

    // Uses http.get() to load a single JSON file
    getFoods() {
        console.log("DemoService-getFoods()");
        console.log(this.http.get('app/data/food.json'));
        return this.http.get('app/data/food.json').map((r: Response) => r.json());
    }
}