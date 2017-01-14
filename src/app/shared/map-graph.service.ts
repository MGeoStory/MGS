import {Injectable} from '@angular/core';
import {DataReferences}from './data-references';
import {DataReference} from './data-reference';

@Injectable()
export class MapGraphService{
    updateDataReference(countyName):void{
        // console.log('updateDataReference');
        //promise用來避免異步錯誤
        Promise.resolve(DataReference.countyID = countyName);
    }

    getDataReference():Promise<DataReferences>{
        console.log('getDataReference');
        console.log(Promise.resolve(DataReference.countyID));
        return Promise.resolve(DataReference);
    }

}// END OF MapGraphService