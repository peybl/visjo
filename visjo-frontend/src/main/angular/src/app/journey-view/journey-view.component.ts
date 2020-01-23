import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { JourneyService } from '../services/Journey/journey.service';
import { Journey } from '../dtos/Journey';
import { Observable } from 'rxjs';
import { Image } from '../dtos/Image';
import { ImagesService } from '../services/Images/images.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as L from "leaflet";
import { SharedJourney } from '../dtos/SharedJourney';

const apiToken = environment.MAPBOX_API_KEY;

@Component({
  selector: 'app-journey-view',
  templateUrl: './journey-view.component.html',
  styleUrls: ['./journey-view.component.scss']
})
export class JourneyViewComponent implements OnInit, OnDestroy, AfterViewInit {
  private sub: any;
  selectedJourney$ : Observable<Journey>;
  imagesOfJourney$ : Observable<Image[]>;
  
  selectedJourneyIdOrUuid : string | number;
  journeyViaUuid = false;
  journeys: Journey[];

  // GPS stuff
  private map: L.Map;
  private markers : L.Marker[] = [];
  private openMarker : L.Marker;

  constructor(private journeyService: JourneyService,
      private imageService: ImagesService,
      private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params["id"]) {
        this.selectedJourneyIdOrUuid = parseInt(params['id']); // id is number
        if (isNaN(this.selectedJourneyIdOrUuid))
          this.selectedJourneyIdOrUuid = undefined;
      }
      else if (params["uuid"]) {
        this.selectedJourneyIdOrUuid = params["uuid"]; // uuid is string
        this.journeyViaUuid = true;
      }
    });
    const self = this;
    this.journeyService.getJourneys().subscribe(jours => {
      self.journeys = jours;
    });
    this.initializeMap();
  }

  ngAfterViewInit() {
    if (this.selectedJourneyIdOrUuid !== undefined) {
      if (this.journeyViaUuid) {
        this.getJourneyFromUuid();
      }
      else {
        this.getJourney();
      }
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub.unsubscribe();
  }

  getJourney() : void {
    if (typeof this.selectedJourneyIdOrUuid === "string")
        this.selectedJourneyIdOrUuid = parseInt(this.selectedJourneyIdOrUuid);
    if (this.selectedJourneyIdOrUuid === undefined)
      return;
    console.debug("getting journey with id " + this.selectedJourneyIdOrUuid);
    this.selectedJourney$ = this.journeyService.getJourneyById(this.selectedJourneyIdOrUuid);
    this.imagesOfJourney$ = this.imageService.getImagesForJourney(this.selectedJourneyIdOrUuid);
    this.imagesOfJourney$.subscribe(images => this.drawMarkersOnMap(images));
  }

  getJourneyFromUuid() : void {
    if (this.selectedJourneyIdOrUuid === undefined)
      return;
    console.debug("getting shared journey with uuid " + this.selectedJourneyIdOrUuid);
    let shj = new SharedJourney();
    shj.uuid = this.selectedJourneyIdOrUuid.toString();
    this.selectedJourney$ = this.journeyService.getJourneyFromSharedJourney(shj);
    this.imagesOfJourney$ = this.imageService.getImagesForSharedJourney(shj);
    this.imagesOfJourney$.subscribe(images => this.drawMarkersOnMap(images));
  }

  focusImage(image: Image) : void {
    if (this.map === null)
      return;
    console.debug("focusing image " + image.id);
    const coords : L.LatLng = L.latLng(image.latitude, image.longitude);
    const zoom = 12; // TODO tune
    this.map.flyTo(coords, zoom);
  }

  initializeMap() : void {
    // const mapOptions: L.MapOptions = {maxZoom: 100};
    this.map = L.map('map').setView({lng: 0, lat: 0}, 5);
    console.debug("map initialized: " + this.map);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 19,
      id: 'mapbox/streets-v11',
      accessToken: apiToken,
    }).addTo(this.map);
    L.control.scale().addTo(this.map);
    L.control.layers().addTo(this.map);
    
  }

  drawMarkersOnMap(images: Image[]) : void {
    this.clearMarkers();
    let first = true;
    this.markers = images.map(img => {
      const lat = img.latitude;
      const lon = img.longitude;
      const markerCoords = L.latLng(lat, lon);
      const markerOptions : L.MarkerOptions = {draggable: false, };
      const marker = L.marker(markerCoords, markerOptions);
      marker.bindPopup(
        "<b>Image "+ img.id +"</b>"
        + "<br><img style='height:auto;' src='"
        + this.getUrlForImage(img.id, 58) + "'/>");
      marker.addTo(this.map);
      if (first) {
        this.focusImage(img);
        this.openMarker = marker.openPopup();
        first = false;
      }
      return marker;
    })
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.removeFrom(this.map));
    this.markers = [];
  }
  
  getUrlForImage(id: string | number, width?: number): string {
    if (this.journeyViaUuid) {
      let url = "http://localhost:8080/s/" + this.selectedJourneyIdOrUuid + "/image/" + id;
      if (width)
        url += "?width=" + width;
      return url;
    }
    else {
      let url = "http://localhost:8080/image/" + id;
      if (width)
        url += "?width=" + width;
      return url;
    }
  }
}
