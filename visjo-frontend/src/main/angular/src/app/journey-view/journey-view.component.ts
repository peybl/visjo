import { Component, OnInit, Input } from '@angular/core';
import { JourneyService } from '../services/Journey/journey.service';
import { Journey } from '../dtos/Journey';

@Component({
  selector: 'app-journey-view',
  templateUrl: './journey-view.component.html',
  styleUrls: ['./journey-view.component.sass']
})
export class JourneyViewComponent implements OnInit {

  @Input()
  private selectedJourneyId : string;
  private selectedJourney : Journey;

  constructor(private journeyService: JourneyService) { }

  ngOnInit() {
    //this.getJourney(this.selectedJourneyId);
  }

  getJourney(journeyId: string) : void {
    this.journeyService.getJourneyById(journeyId).subscribe(j => this.selectedJourney = j);
  }
}
