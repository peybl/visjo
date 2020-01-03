import { Component, OnInit } from '@angular/core';
import { JourneyService } from 'src/app/services/Journey/journey.service';
import { Journey } from '../../dtos/Journey';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';

@Component({
  selector: 'app-journey-overview',
  templateUrl: './journey-overview.component.html',
  styleUrls: ['./journey-overview.component.scss'],
  styles: [` .img-fluid{ min-width:100%}`]
})
export class JourneyOverviewComponent implements OnInit {

  shareLinkDialogRef: MatDialogRef<ShareDialogComponent>;
  emptyJourneyDescription: string;
  journeys: Journey[];

  constructor(private dialog: MatDialog, private journeyService: JourneyService, private auth: AuthService) {
    auth.fetchUsername();
  }

  async ngOnInit() {
    this.emptyJourneyDescription = "...";
    if (this.authenticated()) {
      this.journeys = await this.journeyService.getJourneys();
      console.debug(this.journeys);
    }
  }
  
  authenticated() : boolean {
    return this.auth.authenticated;
  }

  onClickEdit() {
    console.log("edit icon clicked!");
    //link to edit journey
  }

  onClickShare() {
    console.log("share icon clicked!");
    this.shareLinkDialogRef = this.dialog.open(ShareDialogComponent);
  }

}