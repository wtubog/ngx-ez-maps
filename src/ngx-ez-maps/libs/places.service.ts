import { switchMap } from 'rxjs/operators';
import { AppInitService } from './../app-init.service';
import { Injectable, NgZone, Inject } from "@angular/core";
import { Observable } from 'rxjs/Observable';

import { } from '@types/google-maps';

@Injectable()
export class PlacesService {

  constructor(
    private _zone: NgZone,
    private _as: AppInitService
  ) {}

    /**
     * Encapsulates GoogleMaps Places Library's nearBySearch method.
     * @param map - a GoogleMap's map object
     * @param request - PlaceSearchRequest object
     * @return PlaceResult object
     * For reference: https://developers.google.com/maps/documentation/javascript/places
     */

    nearbySearch(map: google.maps.Map, request: google.maps.places.PlaceSearchRequest): Observable<google.maps.places.PlaceResult[]> {
        return this._as.isGooglemapsReady.pipe(
            switchMap(() => {
                return Observable.create((observer) => {
                    const places = new google.maps.places.PlacesService(map);
                    places.nearbySearch(
                        request,
                        (result) => this._zone.runGuarded(() => {
                          observer.next(result);
                          observer.complete();
                        })
                    );
                });
            })
        )
    }

    /**
     * Encapsulates GoogleMaps Places Library's textSearch method.
     * @param map - a GoogleMap's map object
     * @param request - TextSearchRequest object
     * @return PlaceResult object
     * For reference: https://developers.google.com/maps/documentation/javascript/places
     */

    textSearch(map: google.maps.Map, request: google.maps.places.TextSearchRequest): Observable<google.maps.places.PlaceResult[]>{
        return this._as.isGooglemapsReady.pipe(
            switchMap(() => {
                return Observable.create((observer) => {
                    const places = new google.maps.places.PlacesService(map);
                    places.textSearch(
                        request,
                        (result) => this._zone.runGuarded(() => {
                          observer.next(result);
                        })
                    );
                });
            })
        )
    }

    /**
     * Encapsulates GoogleMaps Places Library's textSeargetDetailsch method.
     * @param map - a GoogleMap's map object
     * @param request - PlaceDetailsRequest object
     * @return PlaceResult object
     * For reference: https://developers.google.com/maps/documentation/javascript/places
     */

    getDetails(map: google.maps.Map, request: google.maps.places.PlaceDetailsRequest): Observable<google.maps.places.PlaceResult> {
        return this._as.isGooglemapsReady.pipe(
            switchMap(() => {
                return Observable.create((observer) => {
                    const places = new google.maps.places.PlacesService(map);
                    places.getDetails(
                        request,
                        (result) => this._zone.runGuarded(() => {
                          observer.next(result);
                        })
                    )
                });
            })
        )
    }

}
