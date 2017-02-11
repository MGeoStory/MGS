import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import './rxjs-extensions';

//graph type
import { BarGraph } from './graphs/bar-graph.directive';
import { GoogleMapComponent } from './google-map/google-map.component';
import { LeafletMapComponent } from './leaflet-map/app-leaflet-map.component';
import { ContentComponent } from './content/content.component';
import {DropdownList} from'./dropdown-list/dropdown-list.component'

import { MapGraphService } from './shared/map-graph.service';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { LMapSetting } from './shared/lmap-setting';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDhm69UDMZY-VG4b3HQ3-RImGmlukvNKQ0'
    })
  ],
  declarations: [
    AppComponent,
    BarGraph,
    GoogleMapComponent,
    LeafletMapComponent,
    ContentComponent,
    DropdownList
  ],
  providers: [
    MapGraphService,
    LMapSetting
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
