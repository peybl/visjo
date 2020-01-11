import { Component, OnInit, OnDestroy } from '@angular/core';
import { JourneyService } from 'src/app/services/Journey/journey.service';
import { Journey } from '../../dtos/Journey';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';
import { Router } from '@angular/router';
import {ImagesService} from '../../services/Images/images.service';
import {Image} from "../../dtos/Image";

@Component({
  selector: 'app-journey-overview',
  templateUrl: './journey-overview.component.html',
  styleUrls: ['./journey-overview.component.scss'],
  styles: [` .img-fluid{ min-width:100%}`]
})
export class JourneyOverviewComponent implements OnInit {
  shareLinkDialogRef: MatDialogRef<ShareDialogComponent>;
  emptyJourneyDescription: string;
  journeys: Journey[] = [];
  
  // OLD DATA:
  //
  // images1: Image[] = [
  //   {id: '1', name: 'Image-1', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=602'},
  //   {id: '2', name: 'Image-2', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=603'},
  //   {id: '3', name: 'Image-3', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=604'},
  // ];

  // images2: Image[] = [
  //   {id: '1', name: 'Image-1', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=111'},
  //   {id: '2', name: 'Image-2', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=112'},
  //   {id: '3', name: 'Image-3', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=113'},
  // ];

  // images3: Image[] = [
  //   {id: '1', name: 'Image-1', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=101'},
  //   {id: '2', name: 'Image-2', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=102'},
  //   {id: '3', name: 'Image-3', longitude: 77.1234, latitude: -12.5456, date: new Date(), source: 'https://picsum.photos/900/500?random&t=103'},
  // ];

  // journeys: Journey[] = [
  //   {id: '0', name: 'My Journey-1', description:'My journey description is here', images: this.images1},
  //   {id: '1', name: 'My Journey-2', images: this.images2},
  //   {id: '2', name: 'My Journey-3', description: 'Another journey description', images: this.images3}
  // ];

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

  authenticated(): boolean {
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