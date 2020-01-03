import { Component, OnInit } from '@angular/core';
import { JourneyService } from '../services/Journey/journey.service';
import { Journey } from '../dtos/Journey';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})
export class CreateComponent implements OnInit {
  lastAddedJourney : Journey;

  constructor(private journeyService: JourneyService) { }

  ngOnInit() {
  }

  async createAndUploadNewEmptyJourney() {
    const newj = await this.journeyService.getMockJourney();
    console.debug("new journey:");
    console.debug(newj);
    this.lastAddedJourney = await this.journeyService.postNewJourney(newj);
    console.debug("last added journey:");
    console.debug(this.lastAddedJourney);
  }

}
