import { EzMap } from './ez-map/directives/ez-map.component';
import { PlacesService } from './ez-map/libs/places.service';
import { LocationService } from './ez-map/libs/location.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';


import { } from '@types/google-maps';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    PlacesService
  ]
})
export class AppComponent implements OnInit {
  constructor(
    private _ls: LocationService,
    private _places: PlacesService,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild('map')
  private _map: EzMap;

  pos$: Observable<google.maps.LatLng>;

  markers$: Observable<google.maps.places.PlaceResult[]>;
  
  ngOnInit() {
    this.pos$ = this._ls.getCurrentLocation();
  }

  onBounds(data) {
    console.log(data);
  }

  onCenter(data){
    console.log(data);
  }

  onZoom(data){
    console.log(data);
  }

  ngDoCheck(){
    console.log('checking...');
  }

  onMapReady() {
    
    this.markers$ = this._ls.getCurrentLocation()
      .pipe(
        switchMap((pos: any) => {
          return this._places.nearbySearch(this._map, {
            keyword: "veterinary clinic grooming",
            radius: 3000,
            location: {lat: pos.coords.latitude, lng: pos.coords.longitude}
          })
        })
      )
  }
}
