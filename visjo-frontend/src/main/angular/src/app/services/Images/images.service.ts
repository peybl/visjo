import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { MessagesService } from '../Messages/messages.service';
import { ABaseService } from '../AbstractServices/ABaseService';
import { Image } from 'src/app/dtos/Image';
import { Journey } from 'src/app/dtos/Journey';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SharedJourney } from 'src/app/dtos/SharedJourney';

@Injectable({
  providedIn: 'root'
})
export class ImagesService extends ABaseService{
  private readonly imageUrlPart = "/image";
  private readonly journeyUrlPart = "/journey";
  private readonly shareUrlPart = "/s";

  constructor(private http: HttpClient,
    protected messageService: MessagesService) {
      super(messageService);
  }

  getImagesForJourney(journeyOrId: Journey | number) : Observable<Image[]> {
    let id : number;
    if (typeof journeyOrId === "number")
      id = journeyOrId;
    else
      id = journeyOrId.id;
    const url = this.imageUrlPart + this.journeyUrlPart + "/" + id;
    return this.http.get<Image[]>(url)
      .pipe(
        tap(() => this.log("fetched Images for Journey " + id)),
        catchError(this.handleError<Image[]>("GET getImagesForJourney", []))
      );
  }

  // untested
  getImageById(imageId: number, scaleWidth? : number) : Observable<Image> {
    let url = this.imageUrlPart + "/" + imageId;
    const params = new HttpParams();
    if (scaleWidth)
      params.append("width", scaleWidth.toString());
    
    return this.http.get<Image>(url, { params: params })
      .pipe(
        tap(() => {
          this.log("fetched Image with id: " + imageId);
          if (scaleWidth)
            this.log("and scale: " + scaleWidth);
        }),
        catchError(this.handleError<Image>("GET getImageById"))
      );
  }

  // seems to work
  postNewImage(image: Image) : Observable<Image> {
    const data = new FormData();
    data.append('file', image.file, image.name);
    data.append('journeyId', image.journey + "");
    data.append('latitude', image.latitude + "");
    data.append('longitude', image.longitude + "");
    data.append('timestamp',image.timestamp);
    // console.debug(image);
    // console.debug(file);

    return this.http.post<Image>(this.imageUrlPart, data)
      .pipe(
        tap((img) => this.log("POSTed image " + img.id)),
        catchError(this.handleError<Image>("POST Image"))
      );
  }

  // untested
  getImagesForSharedJourney(sharedJourneyOrUuid: SharedJourney | string) : Observable<Image[]> {
    const uuid = this.getUuid(sharedJourneyOrUuid);
    // @GetMapping(value = "/s/{uuid}/image")
    const url = this.shareUrlPart + "/" + uuid + this.imageUrlPart;
    return this.http.get<Image[]>(url)
      .pipe(
        tap(() => this.log("fetched Images for Journey " + uuid)),
        catchError(this.handleError<Image[]>("GET getImagesForJourney", []))
      );
  }

  getImageForSharedJourneyById(sharedJourneyOrUuid: SharedJourney | string, imageId: number, scaleWidth? : number) : Observable<Image> {
    const uuid = this.getUuid(sharedJourneyOrUuid);
    // @GetMapping(value = "/s/{uuid}/image/{imageId}")
    const url = this.shareUrlPart + "/" + uuid + this.imageUrlPart + imageId;
    const params = new HttpParams();
    if (scaleWidth)
      params.append("width", scaleWidth.toString());
    
    return this.http.get<Image>(url, { params: params })
      .pipe(
        tap(() => {
          this.log("fetched Image with id: " + imageId);
          if (scaleWidth)
            this.log("and scale: " + scaleWidth);
        }),
        catchError(this.handleError<Image>("GET getImageForSharedJourneyById"))
      );
  }

  private getUuid(sharedJourneyOrUuid: SharedJourney | string) {
    let uuid : string;
    if (typeof sharedJourneyOrUuid === "string")
      uuid = sharedJourneyOrUuid;
    else
      uuid = sharedJourneyOrUuid.uuid;
    return uuid;
  }
}
