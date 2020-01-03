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
  private selectedJourneyId : number;
  private selectedJourney : Journey;

  constructor(private journeyService: JourneyService) { }

  ngOnInit() {
    //this.getJourney(this.selectedJourneyId);
  }

  async getJourney(journeyId: number) : Promise<void> {
    this.selectedJourney = await this.journeyService.getJourneyById(journeyId);
  }
}
