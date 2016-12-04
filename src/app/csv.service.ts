import { Injectable } from '@angular/core';
import { Http, Response, HttpModule } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsvService {
    constructor(private http: Http) { }

    // Uses http.get() to load a single csv file
    getCsvData(path: string): Observable<any> {
        return this.http.get(path).map((res: Response) => res);
    }
}