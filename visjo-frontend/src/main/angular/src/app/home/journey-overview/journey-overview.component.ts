import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { JourneyService } from 'src/app/services/Journey/journey.service';
import { Journey } from '../../dtos/Journey';
import { SharedJourney } from '../../dtos/SharedJourney'
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';
import { Router } from '@angular/router';
import {ImagesService} from '../../services/Images/images.service';
import {Image} from "../../dtos/Image";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-journey-overview',
  templateUrl: './journey-overview.component.html',
  styleUrls: ['./journey-overview.component.scss'],
  styles: [` .img-fluid{ min-width:100%}`]
})
export class JourneyOverviewComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  shareLinkDialogRef: MatDialogRef<ShareDialogComponent>;
  emptyJourneyDescription: string;
  journeys: Journey[] = [];
  shareLink: string;

  constructor(private dialog: MatDialog,
      private journeyService: JourneyService,
      private imagesService: ImagesService,
      private auth: AuthService,
      private router: Router) {
    auth.fetchUsername();
  }

  async ngOnInit() {
    this.emptyJourneyDescription = "...";
    const self = this;
    await this.journeyService.getJourneys().subscribe(jours => {
        jours.forEach( async (journey) => {
            journey = await self.loadImages(journey);
            self.journeys.push(journey);
        });
    });
  }

  loadImages(journey: Journey): Promise<Journey> {
      const id = journey.id;
      const self = this;
      return new Promise(function(resolve) {
          self.imagesService.getImagesForJourney(id).subscribe(images => {
              resolve(images);
          });
      }).then(function (images: Image[]) {
          const imgs : Image[] = [];
          images.forEach(async (image) => {
              image.imageUrl = 'http://localhost:8080/image/' + image.id;
              imgs.push(image);
          });
          journey.images = imgs;
          return journey;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  authenticated(): boolean {
    return this.auth.authenticated;
  }

  onClickEdit() {
    console.log("edit icon clicked!");
    //link to edit journey
  }

  onClickShare(jour: Journey) {
      debugger;
    this.journeyService.getSharingLinkForJourney(jour)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(item => {
      this.shareLink = item.url;
    });
    this.shareLinkDialogRef = this.dialog.open(ShareDialogComponent,
      {
        data: {
          dataKey: this.shareLink
        }
      });
    console.log("shareLink: " + this.shareLink);
  }
}