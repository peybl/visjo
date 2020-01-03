import { Injectable } from '@angular/core';
import { Journey } from '../../dtos/Journey';
import { Image } from '../../dtos/Image';
import { MessagesService } from '../Messages/messages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ABaseService } from '../AbstractServices/ABaseService';

@Injectable({
  providedIn: 'root'
})
export class JourneyService extends ABaseService{
  private journeyUrlBase = "localhost:8080/journey";
  private i = 10;
  loading : boolean;
  results : Journey[];

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,
    protected messageService: MessagesService) {
      super(messageService);
    this.results = [];
    this.loading = false;
  }

  getJourneys() : Promise<Journey[]> {
    let promise = this.http.get<Journey[]>(this.journeyUrlBase).toPromise()
    promise.then(j => {
        this.log("fetched Journeys, length = " + j.length);
        this.results = j;
    })
      .catch((e) => {
        console.error("error bla");
    });

    return promise;
  }

  // getMockJourneys() : Journey[] {
  //   const images1: Image[] = [
  //     {id: 1, journey: 1, name: 'Image-1', longitude: 77.1234, latitude: -12.5456, timestamp: new Date().toUTCString(), image: 'https://picsum.photos/900/500?random&t=602'},
  //     {id: 2, journey: 1, name: 'Image-2', longitude: 77.1235, latitude: -12.5456, timestamp: new Date().toUTCString(), image: 'https://picsum.photos/900/500?random&t=603'},
  //     {id: 3, journey: 1, name: 'Image-3', longitude: 77.1234, latitude: -12.5457, timestamp: new Date().toUTCString(), image: 'https://picsum.photos/900/500?random&t=604'},
  //   ];
  
  //   const images2: Image[] = [
  //     {id: 4, journey: 2, name: 'Image-4', longitude: 77.1234, latitude: -12.5456, timestamp: new Date().toUTCString(), image: 'https://picsum.photos/900/500?random&t=111'},
  //     {id: 5, journey: 2, name: 'Image-5', longitude: 77.1235, latitude: -12.5456, timestamp: new Date().toUTCString(), image: 'https://picsum.photos/900/500?random&t=112'},
  //     {id: 6, journey: 2, name: 'Image-6', longitude: 77.1234, latitude: -12.5457, timestamp: new Date().toUTCString(), image: 'https://picsum.photos/900/500?random&t=113'},
  //   ];
  
  //   const images3: Image[] = [
  //     {id: 7, journey: 3, name: 'Image-7', longitude: 77.1234, latitude: -12.5456, timestamp: new Date().toUTCString(), image: 'https://picsum.photos/900/500?random&t=101'},
  //     {id: 8, journey: 3, name: 'Image-8', longitude: 77.1235, latitude: -12.5456, timestamp: new Date().toUTCString(), image: 'https://picsum.photos/900/500?random&t=102'},
  //     {id: 9, journey: 3, name: 'Image-9', longitude: 77.1234, latitude: -12.5457, timestamp: new Date().toUTCString(), image: 'https://picsum.photos/900/500?random&t=103'},
  //   ];
  
  //   const journeys: Journey[] = [
  //     {id: 1, name: 'My Journey-1', description:'My journey description is here', images: images1},
  //     {name: 'My Journey-2'},
  //     {id: 3, name: 'My Journey-3', description: 'Another journey description', images: images3}
  //   ];

  //   return journeys;
  // }

  async getMockJourney(id?: number): Promise<Journey> {
    await new Promise(resolve => setTimeout(() => resolve("wait 500ms"), 500));

    let j: Journey;
    if (id === null)
      j = {name: "Journey-" + (++this.i)};
    else
      j = { id: id, name: "Journey-" + id };
    return j;
  }

  // getMockImage(): Image {
  //   const image : Image = {id: 4, journey: "Journey-"+JourneyService.i, name: 'Image-4', longitude: 77.1234, latitude: -12.5456, timestamp: new Date().toUTCString(), image: 'https://picsum.photos/900/500?random&t=111'};
  //   return image;
  // }

  async getJourneyById(id: number) : Promise<Journey> {
    const url = this.journeyUrlBase + "/" + id;
    const promise = this.http.get<Journey>(url).toPromise();
    promise.then(j => {
      this.log("fetched Journey with ID " + id);
    })
      .catch(() => this.handleError<Journey>("get Journey with ID: " + id));

    return await promise;
  }

  async postNewJourney(journey: Journey) : Promise<Journey> {
    const journeyJson = JSON.stringify(journey);
    console.debug("posting Journey: " + journeyJson);
    const promise = this.http.post<Journey>(this.journeyUrlBase, journey, this.httpOptions).toPromise()
    promise.then((j) => {
      this.log("added new Journey: " + journey.name);
    })
      .catch( () => this.handleError<Journey>("post new Journey"));

    return await promise;
  }

  // ! NYI in backend
  async deleteJourney(journeyIdOrJourney: Journey | number) : Promise<Journey> {
    const id = typeof journeyIdOrJourney === "number" ? journeyIdOrJourney : journeyIdOrJourney.id;
    const url = this.journeyUrlBase + "/" + id;
    const promise = this.http.delete<Journey>(url, this.httpOptions).toPromise();
    promise.then(j => {
      this.log("deleted Journey with id: " + id);
    })
      .catch( () => this.handleError<Journey>("delete journey"));

    return await promise;
  }

  // ! NYI in backend
  async searchJourney(term: string) : Promise<Journey[]> {
    // TODO implement
    const promise = this.http.get<Journey[]>(this.journeyUrlBase + "/?name=" + term).toPromise();
    promise.then(j => this.log("searched Journeys with term " + term))
      .catch(() => this.handleError<Journey[]>("search journey"));
    
    return await promise;
  }
}
