import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-journey-overview',
  templateUrl: './journey-overview.component.html',
  styleUrls: ['./journey-overview.component.sass'],
  styles: [` .img-fluid{ min-width:100%}`]
})
export class JourneyOverviewComponent implements OnInit {

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor() { }

  ngOnInit() {
  }

}