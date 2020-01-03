import { Injectable } from '@angular/core';
import { Journey } from '../../dtos/Journey';
import { MessagesService } from '../Messages/messages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ABaseService } from '../AbstractServices/ABaseService';

@Injectable({
  providedIn: 'root'
})
export class JourneyService extends ABaseService {
  private journeyUrlBase = "/journey";

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,
    protected messageService: MessagesService) {
    super(messageService);
  }

  getJourneys(): Journey[] {
    let journeys: Journey[];
    this.http.get<Journey[]>(this.journeyUrlBase)
      .pipe(
        tap(() => this.log("fetched Journeys")),
        catchError(this.handleError<Journey[]>("getJourneys", []))
      ).subscribe(
        response => {
          console.debug("server respone: " + response);
          journeys = response;
        }, error => {
          console.error("error fetching Journeys: " + error);
        }
      );
    return journeys;
  }

  getJourneyById(id: number): Journey {
    let j: Journey;
    const url = this.journeyUrlBase + "/" + id;
    this.http.get<Journey>(this.journeyUrlBase)
      .pipe(
        map(journeys => journeys[0]),
        tap(j => {
          const outcome = j ? "fetched" : "didn't find";
          this.log(outcome + " Journey with ID " + id)
        }),
        catchError(this.handleError<Journey>("get Journey with ID: " + id))
      ).subscribe(response => {
        console.debug("server respone: " + response);
        j = response;
      }, error => {
        console.error("error fetching Journey with id: " + id+ ": " + error);
      });
    return j;
  }

  postNewJourney(journey: Journey): Journey {
    let newJourney: Journey;
    this.http.post<Journey>(this.journeyUrlBase, journey, this.httpOptions)
      .pipe(
        tap(() => this.log("added new Journey: " + journey.name)),
        catchError(this.handleError<Journey>("post new Journey"))
      ).subscribe(response => {
        console.debug("server respone: " + response);
        newJourney = response;
      }, error => {
        console.error("error posting new Journey " + journey.name+ ": " + error);
      });
    return newJourney;
  }

  // ! NYI in backend
  deleteJourney(journey: Journey | number): Journey {
    let deletedJourney: Journey;
    const id = typeof journey === "number" ? journey : journey.id;
    const url = this.journeyUrlBase + "/" + id;
    this.http.delete<Journey>(url, this.httpOptions)
      .pipe(
        tap(() => this.log("deleted Journey with id: " + id)),
        catchError(this.handleError<Journey>("delete journey"))
      ).subscribe(response => {
        console.debug("server respone: " + response);
        deletedJourney = response;
      }, error => {
        console.error("error deleting Journey " + id + ": " + error);
      });
    return deletedJourney;
  }

  // ! NYI in backend
  searchJourney(term: string): Journey[] {
    let foundJourneys: Journey[];
    if (!term.trim())
      return [];
    this.http.get<Journey[]>(this.journeyUrlBase + "/?name=" + term)
      .pipe(
        tap(() => this.log("found Journey matching " + term)),
        catchError(this.handleError<Journey[]>("search journeys", []))
      )
      .subscribe(response => {
        console.debug("server respone: " + response);
        foundJourneys = response;
      }, error => {
        console.error("error fetching Journey search: " + error);
      });
    return foundJourneys;
  }
}
