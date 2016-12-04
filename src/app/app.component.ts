import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DemoService } from './demo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  public foods;
  public books;
  public movies;
  public foods_error: Boolean = false;

  constructor(private dm: DemoService) { }

  ngOnInit() {
    this.getFoods();
    console.log('AppComponent-ngOnInit');
  }

  getFoods() {
    this.dm.getFoods().subscribe(
      // the first argument is a function which runs on success
      data => { this.foods = data },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading foods')
    );
  }
}

