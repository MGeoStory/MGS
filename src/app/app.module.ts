import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

//graph type
import { BarGraph } from './bar-graph.directive';

import { DemoService } from './demo.service';
import './rxjs-extensions';

@NgModule({
  declarations: [
    AppComponent,
    BarGraph
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [DemoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
