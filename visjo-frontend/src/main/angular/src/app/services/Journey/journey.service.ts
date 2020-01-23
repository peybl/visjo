import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Journey } from '../../dtos/Journey';
import { ABaseService } from '../AbstractServices/ABaseService';
import { MessagesService } from '../Messages/messages.service';
import { SharedJourney } from 'src/app/dtos/SharedJourney';

@Injectable({
  providedIn: 'root'
})
export class JourneyService extends ABaseService {
  private readonly journeyUrlBase = "/journey";
  private readonly shareUrlPart = "/s";

  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,
    protected messageService: MessagesService) {
    super(messageService);
  }

  // tested, works
  getJourneys(): Observable<Journey[]> {
    return this.http.get<Journey[]>(this.journeyUrlBase)
      .pipe(
        tap(() => this.log("fetched Journeys")),
        catchError(this.handleError<Journey[]>("getJourneys", []))
      );
  }

  // ! untested
  getJourneyById(id: number): Observable<Journey> {
    const url = this.journeyUrlBase + "/" + id;
    return this.http.get<Journey>(url)
      .pipe(
        // map(journeys => journeys[0]),
        tap(j => {
          const outcome = j !== undefined ? "fetched" : "didn't find";
          this.log(outcome + " Journey with ID " + id + ", is " + j);
        }),
        catchError(this.handleError<Journey>("get Journey with ID: " + id))
      );
  }

  // tested, works
  postNewJourney(journeyOrName: Journey | string): Observable<Journey> {
    let name : string;
    if (typeof journeyOrName === "string")
      name = journeyOrName;
    else
      name = journeyOrName.name;
    const formData = new FormData();
    formData.append("name", name);
    return this.http.post<Journey>(this.journeyUrlBase, formData)
      .pipe(
        tap(() => this.log("added new Journey: " + name)),
        catchError(this.handleError<Journey>("post new Journey"))
      );
  }

  // unested
  updateJourney(journey: Journey) : Observable<Journey> {
    const id =  journey.id;
    const url = this.journeyUrlBase + "/" + id;
    if (id === null)
      throw "Journey ID to update was null"
    if (journey.name === null)
      throw "Journey Name to update was null"
    
    const formData = new FormData();
    formData.append("name", journey.name);

    return this.http.put<Journey>(this.journeyUrlBase, formData)
      .pipe(
        tap(() => this.log("updated Journey with ID " + id + "to name " + journey.name)),
        catchError(this.handleError<Journey>("update journey"))
      );
  }

  // ! NYI in backend, untested
  deleteJourney(journey: Journey | number): Observable<Journey> {
    const id = typeof journey === "number" ? journey : journey.id;
    const url = this.journeyUrlBase + "/" + id;
    return this.http.delete<Journey>(url)
      .pipe(
        tap(() => this.log("deleted Journey with id: " + id)),
        catchError(this.handleError<Journey>("delete journey"))
      );
  }

  // ! NYI in backend, untested, unused and unfunctional
  // searchJourney(term: string): Observable<Journey[]> {
  //   if (!term.trim())
  //     return of([]);
  //   return this.http.get<Journey[]>(this.journeyUrlBase + "/?name=" + term)
  //     .pipe(
  //       tap(() => this.log("found Journey matching " + term)),
  //       catchError(this.handleError<Journey[]>("search journeys", []))
  //     );
  // }

  // untested
  getSharingLinkForJourney(journey: Journey | number): Observable<SharedJourney> {
    const id = typeof journey === "number" ? journey : journey.id;
    const url = this.journeyUrlBase + "/" + id + "/" + "share";

    return this.http.put<SharedJourney>(url, "")
    .pipe(
      tap(() => this.log("enabled sharing Journey with ID " + id)),
      catchError(this.handleError<SharedJourney>("enable journey sharing"))
    );
  }

  // untested
  disableSharingForJourney(journey: Journey | number): Observable<SharedJourney> {
    const id = typeof journey === "number" ? journey : journey.id;
    const url = this.journeyUrlBase + "/" + id + "/" + "share";

    return this.http.delete<SharedJourney>(url)
    .pipe(
      tap(() => this.log("disabled sharing Journey with ID " + id)),
      catchError(this.handleError<SharedJourney>("disable journey sharing"))
    );
  }

  // untested
  /**
   * This method is for getting the Journey object from the DB via a shared link
   * @param sharedJourney the SharedJourney with the UUID 
   * @returns the Journey gotten from the URL
   */
  getJourneyFromSharedJourney(sharedJourney: SharedJourney): Observable<Journey> {
    const url = sharedJourney.url;

    return this.http.get<Journey>(url)
    .pipe(
      tap(() => this.log("got shared journey ID " + sharedJourney.id)),
      catchError(this.handleError<Journey>("get from shared journey"))
    );
  }
}
