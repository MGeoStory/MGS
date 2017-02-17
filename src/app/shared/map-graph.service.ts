import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class MapGraphService{

    // Observable string sources
    private refMapClickedSource = new Subject<string>();
    private refYearSource= new Subject<string>(); 
    // Observable string streams
    refCountry$ = this.refMapClickedSource.asObservable();
    refYear = this.refYearSource.asObservable();

    //dropdown list of years
    announceRefYear(refYear:string){
        this.refYearSource.next(refYear);
    }
    confirmRefYear(refYear:string){
        this.refYearSource.next(refYear);
    }

    // Service message commands
    announceRefId (refCountry:string){
        this.refMapClickedSource.next(refCountry);
     }

    confirmRefId(refCountry:string){
        this.refMapClickedSource.next(refCountry);
    }
}// END OF MapGraphService