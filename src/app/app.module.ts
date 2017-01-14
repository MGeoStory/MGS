import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import './rxjs-extensions';

//graph type
import { BarGraph } from './bar-graph.directive';
import { GoogleMapComponent } from './google-map/google-map.component';
import { LeafletMapComponent } from './leaflet-map/app-leaflet-map.component';

import {MapGraphService} from './shared/map-graph.service';

import { AgmCoreModule } from 'angular2-google-maps/core';

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
    LeafletMapComponent
  ],
  providers: [MapGraphService],
  bootstrap: [AppComponent]
})
export class AppModule { }
