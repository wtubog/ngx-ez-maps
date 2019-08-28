import { EzMarkerComponent } from './../../src/ngx-ez-maps/components/ez-marker.component';
import { EzMapComponent } from '../../src/ngx-ez-maps/components/ez-map.component';
import { PlacesService } from '../../src/ngx-ez-maps/libs/places.service';
import { LocationService } from '../../src/ngx-ez-maps/libs/location.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { switchMap, tap, take, delay } from 'rxjs/operators';

import 'rxjs/add/observable/of';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PlacesService]
})
export class AppComponent implements OnInit {
  constructor(
    private _ls: LocationService,
    private _places: PlacesService,
    private cdr: ChangeDetectorRef
  ) {}

  private _map: any;
  private _activeMarker: EzMarkerComponent;

  pos$: Observable<Position>;
  curPos: any;

  markers$: Observable<google.maps.places.PlaceResult[]>;

  ngOnInit() {
    this.pos$ = this._ls.getCurrentLocation().pipe(
      take(1),
      tap(data => {
        this.curPos = {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        };
      })
    );
    this._ls
      .watchPosition()
      .subscribe(
        data => console.log(data),
        err => console.log(err),
        () => console.log('completed!')
      );

    setTimeout(() => {
      console.log('clearing watch...');
      this._ls.clearWatch();
    }, 20000);
  }

  onBounds(data) {
    console.log(data);
  }

  onCenter(data) {
    console.log('Center changed');
    this._places
      .nearbySearch(this._map, {
        keyword: 'veterinary grooming',
        radius: 5000,
        location: {
          lat: data.lat(),
          lng: data.lng()
        }
      })
      .subscribe(_data => {
        console.log(_data);
      });
  }

  onZoom(data) {
    console.log(data);
  }

  onMapReady(map) {
    this._map = map;
    this.markers$ = this._places
      .nearbySearch(map, {
        keyword: 'veterinary grooming',
        radius: 5000,
        location: this.curPos
      })
      .pipe(tap(data => console.log(data)));
  }

  onMarkerClicked(marker: EzMarkerComponent) {
    this._activeMarker = marker;
    marker.setAnimation('BOUNCE');
    console.log(this);
  }

  onInfoWindowClose() {
    this._activeMarker.setAnimation(null);
  }

  onMapClicked() {
    this._activeMarker.setAnimation(null);

    this._activeMarker = null;
  }
}
