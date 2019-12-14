import { Component, OnInit } from '@angular/core';
import { JourneyService } from 'src/app/services/Journey/journey.service';
import { Journey } from '../../dtos/Journey';
import { Image } from '../../dtos/Image';

@Component({
  selector: 'app-journey-overview',
  templateUrl: './journey-overview.component.html',
  styleUrls: ['./journey-overview.component.sass'],
  styles: [` .img-fluid{ min-width:100%}`]
})
export class JourneyOverviewComponent implements OnInit {
  
  images1: Image[] = [
    {id: '1', name: 'Image-1', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=602'},
    {id: '2', name: 'Image-2', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=602'},
    {id: '3', name: 'Image-3', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=602'},
  ];

  images2: Image[] = [
    {id: '1', name: 'Image-1', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=602'},
    {id: '2', name: 'Image-2', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=602'},
    {id: '3', name: 'Image-3', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=602'},
  ];

  journeys: Journey[] = [
    {id: '0', name: 'My Journey-1', images: this.images1},
    {id: '1', name: 'My Journey-2', images: this.images2}
  ];

  //images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor(private journeyService: JourneyService) { }

  ngOnInit() {
  }

  getJourneys(): void {

  }

}