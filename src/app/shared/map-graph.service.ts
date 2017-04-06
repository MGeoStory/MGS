import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MapGraphService {

    // Observable string sources
    private refMapClickedSource = new Subject<string>();
    private refTimeSource = new Subject<Array<string>>();

    //when perpare dropdwonlist, set data formatted
    private refDataSource = new Subject<Array<Object>>();

    // Observable string streams
    refId = this.refMapClickedSource.asObservable();
    refTime = this.refTimeSource.asObservable();
    refData = this.refDataSource.asObservable();

    // dropdown list of years
    announceRefTime(refTime: Array<string>) {
        console.log(refTime);
        this.refTimeSource.next(refTime);
    }
    confirmRefTime(refTime: Array<string>) {
        this.refTimeSource.next(refTime);
    }

    //data formatted
    announceRefData(refData: Array<Object>) {
        this.refDataSource.next(refData);
    }
    // confirmRefData(refData: Array<Object>) {
    //     this.refDataSource.next(refData);
    // }

    // Service message commands
    announceRefId(refCountry: string) {
        this.refMapClickedSource.next(refCountry);
    }

    confirmRefId(refCountry: string) {
        this.refMapClickedSource.next(refCountry);
    }
}// END OF MapGraphService