import { Component, OnInit, Input } from '@angular/core';
import { JourneyService } from '../services/Journey/journey.service';
import { Journey } from '../dtos/Journey';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-journey-view',
  templateUrl: './journey-view.component.html',
  styleUrls: ['./journey-view.component.sass']
})
export class JourneyViewComponent implements OnInit {
  selectedJourney$ : Observable<Journey>;
  @Input()
  private selectedJourneyId : number;

  constructor(private journeyService: JourneyService) { }

  ngOnInit() {
    this.getJourney(this.selectedJourneyId);
  }

  getJourney(journeyId: number) :void {
    this.selectedJourney$ = this.journeyService.getJourneyById(journeyId);
  }
}
