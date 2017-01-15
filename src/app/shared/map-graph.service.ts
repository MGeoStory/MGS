import {Injectable} from '@angular/core';
import {DataReferences}from './data-references';
import {DataReference} from './data-reference';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class MapGraphService{

    // Observable string sources
    private refIdSource = new Subject<string>();
    
    // Observable string streams
    refId$ = this.refIdSource.asObservable();

    // Service message commands
    announceRefId (refId:string){
        console.log('announceRefId');
        this.refIdSource.next(refId);
    }

    confirmRefId(refId:string){
        console.log('confirmRefId');
        this.refIdSource.next(refId);
    }
}// END OF MapGraphService