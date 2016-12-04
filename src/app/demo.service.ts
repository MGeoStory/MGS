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
        //we use http.get() to run our HTTP request. This returns an Observable object,.
        //Angular doesn't yet know that we want to parse the response as JSON.
        //We can let it know this by using the .map((res:Response) => res.json())call
        return this.http.get('app/data/food.json').map((r: Response) => r.json());
    }
}