import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import './rxjs-extensions';

//graph type
import { GoogleMapComponent } from './google-map/google-map.component';

import { MapGraphService } from './shared/map-graph.service';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { LMapSetting } from './shared/lmap-setting';

import { DropdownModule } from 'ng2-bootstrap';
import { SelectModule } from 'ng2-select';


import { PostReceiptComponent } from './post/receipt/post-receipt.component';
import { DropdownListComponent } from './post/receipt/dropdown-list/dropdown-list.component'
import { ReceiptMapComponent } from './post/receipt/map/receipt-map.component';
import { BarGraph } from './post/receipt/graphs/bar-graph.directive';
import { ContentComponent } from './post/receipt/content/content.component';
export const PostReceiptComponents = [
  PostReceiptComponent,
  DropdownListComponent,
  ReceiptMapComponent,
  BarGraph,
  ContentComponent
];


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDhm69UDMZY-VG4b3HQ3-RImGmlukvNKQ0'
    }),
    DropdownModule.forRoot(),
    SelectModule,
  ],
  declarations: [
    AppComponent,
    GoogleMapComponent,
    PostReceiptComponents
  ],
  providers: [
    MapGraphService,
    LMapSetting
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
