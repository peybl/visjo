import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { MessagesService } from '../Messages/messages.service';
import { ABaseService } from '../AbstractServices/ABaseService';
import { Image } from 'src/app/dtos/Image';
import { Journey } from 'src/app/dtos/Journey';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesService extends ABaseService{
  private readonly imageUrlBase = "/image";
  private readonly journeySubUrl = "/journey";
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,
    protected messageService: MessagesService) {
      super(messageService);
  }

  // untested
  getImagesForJourney(journeyOrId: Journey | number) : Observable<Image[]> {
    let id : number;
    if (typeof journeyOrId === "number")
      id = journeyOrId;
    else
      id = journeyOrId.id;
    const url = this.imageUrlBase + this.journeySubUrl + "/" + id;
    return this.http.get<Image[]>(url)
      .pipe(
        tap(() => this.log("fetched Images for Journey " + id)),
        catchError(this.handleError<Image[]>("GET getImagesForJourney", []))
      );
  }

  // untested
  getImageById(id: number, scaleWidth? : number) : Observable<Image> {
    let url = this.imageUrlBase + "/" + id;
    const params = new HttpParams();
    if (scaleWidth)
      params.append("width", scaleWidth.toString());
    
    return this.http.get<Image>(url, { params: params })
      .pipe(
        tap(() => {
          this.log("fetched Image with id: " + id);
          if (scaleWidth)
            this.log("and scale: " + scaleWidth);
        }),
        catchError(this.handleError<Image>("GET getImageById"))
      );
  }

  // untested
  postNewImage(image: Image) : Observable<Image> {
    const data = new FormData();
    data.append('file', image.file, image.name);
    data.append('journeyId', image.journey + "");
    data.append('latitude', image.latitude + "");
    data.append('longitude', image.longitude + "");
    data.append('timestamp',image.timestamp);
    // console.debug(image);
    // console.debug(file);

    return this.http.post<Image>(this.imageUrlBase, data)
      .pipe(
        tap((img) => this.log("POSTed image " + img.id)),
        catchError(this.handleError<Image>("POST Image"))
      );
  }
}
