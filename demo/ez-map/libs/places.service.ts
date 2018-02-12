import { EzMap } from './../directives/ez-map.component';
import { Injectable, NgZone, Inject } from "@angular/core";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PlacesService {

  constructor(
    private _zone: NgZone
  ) {}

    nearbySearch(map: any, request: google.maps.places.PlaceSearchRequest): Observable<google.maps.places.PlaceResult[]> {
        return Observable.create((observer) => {
            const places = new google.maps.places.PlacesService(map);
            places.nearbySearch(
                request,
                (result) => this._zone.runGuarded(() => {
                  observer.next(result);
                  observer.complete();
                })
            );

        })
    }

    textSearch(map: EzMap, request: google.maps.places.TextSearchRequest): Observable<google.maps.places.PlaceResult[]>{
        return Observable.create((observer) => {
            const places = new google.maps.places.PlacesService(map.getMapInstance());
            places.textSearch(
                request,
                (result) => this._zone.runGuarded(() => {
                  observer.next(result);
                })
            );
        });
    }

    getDetails(map: EzMap, request: google.maps.places.PlaceDetailsRequest): Observable<google.maps.places.PlaceResult> {
        return Observable.create((observer) => {
            const places = new google.maps.places.PlacesService(map.getMapInstance());
            places.getDetails(
                request,
                (result) => this._zone.runGuarded(() => {
                  observer.next(result);
                })
            )
        });
    }

}
