import { Component, OnInit } from '@angular/core';
import { JourneyService } from '../services/Journey/journey.service';
import { Journey } from '../dtos/Journey';
import { Observable } from 'rxjs';

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

  createAndUploadNewEmptyJourney() {
    const newj : Journey = {name: "new journey " + Math.ceil(Math.random() * 100)};
    console.debug("new journey:");
    console.debug(newj);
    this.journeyService.postNewJourney(newj).subscribe(
      response => this.lastAddedJourney = response
    );
    console.debug("last added journey:");
    console.debug(this.lastAddedJourney);
  }

}
