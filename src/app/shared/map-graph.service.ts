import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class MapGraphService{

    // Observable string sources
    private refClickedSource = new Subject<string>();
    
    // Observable string streams
    refCountry$ = this.refClickedSource.asObservable();

    // Service message commands
    announceRefId (refCountry:string){
        console.log('announceRefId');
        this.refClickedSource.next(refCountry);
     }

    confirmRefId(refCountry:string){
        console.log('confirmRefId');
        this.refClickedSource.next(refCountry);
    }
}// END OF MapGraphService