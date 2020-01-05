import { Component, OnInit, Input } from '@angular/core';
import { JourneyService } from '../services/Journey/journey.service';
import { Journey } from '../dtos/Journey';
import { Observable } from 'rxjs';
import { Image } from '../dtos/Image';
import { ImagesService } from '../services/Images/images.service';

@Component({
  selector: 'app-journey-view',
  templateUrl: './journey-view.component.html',
  styleUrls: ['./journey-view.component.sass']
})
export class JourneyViewComponent implements OnInit {
  selectedJourney$ : Observable<Journey>;
  imagesOfJourney$ : Observable<Image[]>;
  // @Input()
  selectedJourneyId : number;

  constructor(private journeyService: JourneyService,
      private imageService: ImagesService) { }

  ngOnInit() {}

  getJourney() :void {
    console.debug("getting journey with id " + this.selectedJourneyId);
    this.selectedJourney$ = this.journeyService.getJourneyById(this.selectedJourneyId);
    this.imagesOfJourney$ = this.imageService.getImagesForJourney(this.selectedJourneyId);
  }
}
