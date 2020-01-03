import { Injectable } from '@angular/core';
import { Journey } from '../../dtos/Journey';
import { MessagesService } from '../Messages/messages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ABaseService } from '../AbstractServices/ABaseService';
import { Observable, of } from 'rxjs';

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

  getJourneys(): Observable<Journey[]> {
    return this.http.get<Journey[]>(this.journeyUrlBase)
      .pipe(
        tap(() => this.log("fetched Journeys")),
        catchError(this.handleError<Journey[]>("getJourneys", []))
      );
  }

  getJourneyById(id: number): Observable<Journey> {
    const url = this.journeyUrlBase + "/" + id;
    return this.http.get<Journey>(url)
      .pipe(
        map(journeys => journeys[0]),
        tap(j => {
          const outcome = j ? "fetched" : "didn't find";
          this.log(outcome + " Journey with ID " + id)
        }),
        catchError(this.handleError<Journey>("get Journey with ID: " + id))
      );
  }

  postNewJourney(journey: Journey): Observable<Journey> {
    const formData = new FormData();
    formData.append("name", journey.name);
    return this.http.post<Journey>(this.journeyUrlBase, formData)
      .pipe(
        tap(() => this.log("added new Journey: " + journey.name)),
        catchError(this.handleError<Journey>("post new Journey"))
      );
  }

  // ! NYI in backend
  deleteJourney(journey: Journey | number): Observable<Journey> {
    const id = typeof journey === "number" ? journey : journey.id;
    const url = this.journeyUrlBase + "/" + id;
    return this.http.delete<Journey>(url, this.httpOptions)
      .pipe(
        tap(() => this.log("deleted Journey with id: " + id)),
        catchError(this.handleError<Journey>("delete journey"))
      );
  }

  // ! NYI in backend
  searchJourney(term: string): Observable<Journey[]> {
    if (!term.trim())
      return of([]);
    return this.http.get<Journey[]>(this.journeyUrlBase + "/?name=" + term)
      .pipe(
        tap(() => this.log("found Journey matching " + term)),
        catchError(this.handleError<Journey[]>("search journeys", []))
      );
  }
}
