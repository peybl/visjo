import { Component, OnInit } from '@angular/core';
import { JourneyService } from 'src/app/services/Journey/journey.service';
import { Journey } from '../../dtos/Journey';
import { Image } from '../../dtos/Image';

@Component({
  selector: 'app-journey-overview',
  templateUrl: './journey-overview.component.html',
  styleUrls: ['./journey-overview.component.scss'],
  styles: [` .img-fluid{ min-width:100%}`]
})
export class JourneyOverviewComponent implements OnInit {
  emptyJourneyDescription: string;
  
  images1: Image[] = [
    {id: '1', name: 'Image-1', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=602'},
    {id: '2', name: 'Image-2', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=603'},
    {id: '3', name: 'Image-3', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=604'},
  ];

  images2: Image[] = [
    {id: '1', name: 'Image-1', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=111'},
    {id: '2', name: 'Image-2', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=112'},
    {id: '3', name: 'Image-3', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=113'},
  ];

  images3: Image[] = [
    {id: '1', name: 'Image-1', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=101'},
    {id: '2', name: 'Image-2', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=102'},
    {id: '3', name: 'Image-3', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=103'},
  ];

  journeys: Journey[] = [
    {id: '0', name: 'My Journey-1', description:'My journey description is here', images: this.images1},
    {id: '1', name: 'My Journey-2', images: this.images2},
    {id: '2', name: 'My Journey-3', description: 'Another journey description', images: this.images3}
  ];

  constructor(private journeyService: JourneyService) { }

  ngOnInit() {
    this.emptyJourneyDescription = "...";
  }

  getJourneys(): void {

  }
  

  onClickEdit() {
    console.log("edit icon clicked!");
    //edit journey
  }

  onClickShare() {
    console.log("share icon clicked!");
    //create a shareable link in a window
  }

}