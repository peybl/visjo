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

  allJourneys : Journey[] = [];
  requestedJourney: Journey;
  createdJourney: Journey;
  deletedJourney: Journey;
  searchResults: Journey[] = [];

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,
    protected messageService: MessagesService) {
    super(messageService);
  }

  getJourneys(): Journey[] {
    this.http.get<Journey[]>(this.journeyUrlBase)
      .pipe(
        tap(() => this.log("fetched Journeys")),
        catchError(this.handleError<Journey[]>("getJourneys", []))
      ).subscribe(
        response => {
          console.debug("server respone: " + response);
          this.allJourneys = response;
        }, error => {
          console.error("error fetching Journeys: " + error);
        },
      );
    return this.allJourneys;
  }

  getJourneyById(id: number): Journey {
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
        this.requestedJourney = response;
      }, error => {
        console.error("error fetching Journey with id: " + id+ ": " + error);
      });
    return this.requestedJourney;
  }

  postNewJourney(journey: Journey): Journey {
    const journeyToPost : Journey = {name: journey.name};
    this.http.post<Journey>(this.journeyUrlBase, journeyToPost, this.httpOptions)
      .pipe(
        tap(() => this.log("added new Journey: " + journey.name)),
        catchError(this.handleError<Journey>("post new Journey"))
      ).subscribe(response => {
        console.debug("server respone: " + response);
        this.createdJourney = response;
      }, error => {
        console.error("error posting new Journey " + journey.name+ ": " + error);
      });
    return this.createdJourney;
  }

  // ! NYI in backend
  deleteJourney(journey: Journey | number): Journey {
    const id = typeof journey === "number" ? journey : journey.id;
    const url = this.journeyUrlBase + "/" + id;
    this.http.delete<Journey>(url, this.httpOptions)
      .pipe(
        tap(() => this.log("deleted Journey with id: " + id)),
        catchError(this.handleError<Journey>("delete journey"))
      ).subscribe(response => {
        console.debug("server respone: " + response);
        this.deletedJourney = response;
      }, error => {
        console.error("error deleting Journey " + id + ": " + error);
      });
    return this.deletedJourney;
  }

  // ! NYI in backend
  searchJourney(term: string): Journey[] {
    if (!term.trim())
      return [];
    this.http.get<Journey[]>(this.journeyUrlBase + "/?name=" + term)
      .pipe(
        tap(() => this.log("found Journey matching " + term)),
        catchError(this.handleError<Journey[]>("search journeys", []))
      )
      .subscribe(response => {
        console.debug("server respone: " + response);
        this.searchResults = response;
      }, error => {
        console.error("error fetching Journey search: " + error);
      });
    return this.searchResults;
  }
}
