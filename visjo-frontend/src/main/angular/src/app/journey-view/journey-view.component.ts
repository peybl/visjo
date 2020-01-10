import { Component, OnInit, AfterViewInit } from '@angular/core';
import { JourneyService } from '../services/Journey/journey.service';
import { Journey } from '../dtos/Journey';
import { Observable } from 'rxjs';
import { Image } from '../dtos/Image';
import { ImagesService } from '../services/Images/images.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as L from "leaflet";

const apiToken = environment.MAPBOX_API_KEY;

@Component({
  selector: 'app-journey-view',
  templateUrl: './journey-view.component.html',
  styleUrls: ['./journey-view.component.sass']
})
export class JourneyViewComponent implements OnInit, AfterViewInit {
  selectedJourney$ : Observable<Journey>;
  imagesOfJourney$ : Observable<Image[]>;
  // @Input()
  selectedJourneyId : number;
  journeys: Journey[];

  // GPS stuff
  private map: L.Map;
  private markers : L.Marker[] = [];

  constructor(private journeyService: JourneyService,
      private imageService: ImagesService,
      private route: ActivatedRoute) { }

  ngOnInit() {
    this.selectedJourneyId = this.route.snapshot.params["id"];
    const self = this;
    this.journeyService.getJourneys().subscribe(jours => {
      self.journeys = jours;
    });
    this.initializeMap();
  }

  ngAfterViewInit() {
    if (this.selectedJourneyId !== undefined) {
      this.getJourney();
    }
  }

  getJourney() : void {
    if (typeof this.selectedJourneyId === "string")
        this.selectedJourneyId = parseInt(this.selectedJourneyId);
    if (this.selectedJourneyId === undefined)
      return;
    console.debug("getting journey with id " + this.selectedJourneyId);
    this.selectedJourney$ = this.journeyService.getJourneyById(this.selectedJourneyId);
    this.imagesOfJourney$ = this.imageService.getImagesForJourney(this.selectedJourneyId);
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
    
  }

  drawMarkersOnMap(images: Image[]) : void {
    this.markers.forEach(marker => marker.removeFrom(this.map));
    let first = true;
    this.markers = images.map(img => {
      const lat = img.latitude;
      const lon = img.longitude;
      const markerCoords = L.latLng(lat, lon);
      const markerOptions : L.MarkerOptions = {draggable: false, };
      const marker = L.marker(markerCoords, markerOptions);
      marker.bindPopup("<b>Image "+ img.id +"</b><br><img style='width:58px;height:auto;' src='http://localhost:8080/image/" + img.id + "'/>")
      marker.addTo(this.map);
      if (first) {
        this.focusImage(img);
        marker.openPopup();
        first = false;
      }
      return marker;
    })
  }

  clearMarkers() {
    // TODO
  }
  
}
