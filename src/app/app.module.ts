import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import './rxjs-extensions';

//ng2-Moudle
import { DropdownModule } from 'ng2-bootstrap';
import { SelectModule } from 'ng2-select';
import { ModalModule } from 'ng2-bootstrap';
import { NouisliderComponent } from 'ng2-nouislider';

//sharedService
import { MapGraphService } from './shared/map-graph.service';
import { LMapSetting } from './shared/lmap-setting';

//home-page
import { HomeComponent } from './home/home-component';
export const HomeComponents = [
  HomeComponent,
];


//post-receipt
import { PostReceiptComponent } from './post/receipt/post-receipt.component';
import { DropdownListComponent } from './post/receipt/dropdown-list/dropdown-list.component'
import { ReceiptMapComponent } from './post/receipt/map/receipt-map.component';
import { BarGraph } from './post/receipt/bar-graph/bar-graph.directive';
import { ContentComponent } from './post/receipt/content/content.component';

export const PostReceiptComponents = [
  PostReceiptComponent,
  DropdownListComponent,
  ReceiptMapComponent,
  BarGraph,
  ContentComponent
];

import { routing } from './app.routes';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    DropdownModule.forRoot(),
    ModalModule.forRoot(),
    SelectModule,
    
  ],
  declarations: [
    AppComponent,
    HomeComponents,
    PostReceiptComponents,
    NouisliderComponent,
  ],
  providers: [
    MapGraphService,
    LMapSetting
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
