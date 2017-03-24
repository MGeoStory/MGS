import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import './rxjs-extensions';

import { DropdownModule } from 'ng2-bootstrap';
import { SelectModule } from 'ng2-select';

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
import { BarGraph } from './post/receipt/graphs/bar-graph.directive';
import { ContentComponent } from './post/receipt/content/content.component';
export const PostReceiptComponents = [
  PostReceiptComponent,
  DropdownListComponent,
  ReceiptMapComponent,
  BarGraph,
  ContentComponent
];

import { routes } from './app.routes';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    // RouterModule.forRoot(routes),
    // routing,
    RouterModule.forRoot(routes),
    DropdownModule.forRoot(),
    SelectModule,
  ],
  declarations: [
    AppComponent,
    HomeComponents,
    PostReceiptComponents
  ],
  providers: [
    MapGraphService,
    LMapSetting
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
