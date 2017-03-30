import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MapGraphService {

    // Observable string sources
    private refMapClickedSource = new Subject<string>();
    private refYearSource = new Subject<string>();

    //when perpare dropdwonlist, set data formatted
    private refDataSource = new Subject<Array<Object>>();

    // Observable string streams
    refId = this.refMapClickedSource.asObservable();
    refYear = this.refYearSource.asObservable();
    refData = this.refDataSource.asObservable();

    //dropdown list of years
    announceRefYear(refYear: string) {
        this.refYearSource.next(refYear);
    }
    confirmRefYear(refYear: string) {
        this.refYearSource.next(refYear);
    }

    //data formatted
    announceRefData(refData: Array<Object>) {
        this.refDataSource.next(refData);
    }
    confirmRefData(refData: Array<Object>) {
        this.refDataSource.next(refData);
    }

    // Service message commands
    announceRefId(refCountry: string) {
        this.refMapClickedSource.next(refCountry);
    }

    confirmRefId(refCountry: string) {
        this.refMapClickedSource.next(refCountry);
    }
}// END OF MapGraphService