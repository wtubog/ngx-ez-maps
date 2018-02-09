import { EzMap } from './../directives/ez-map.component';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PlacesService {
    
    nearbySearch(map: EzMap, request: google.maps.places.PlaceSearchRequest): Observable<google.maps.places.PlaceResult[]> {
        return Observable.create((observer) => {
            const places = new google.maps.places.PlacesService(map.getMapInstance());
            places.nearbySearch(
                request, 
                (result) => observer.next(result)
            );
            
        })
    }

    textSearch(map: EzMap, request: google.maps.places.TextSearchRequest): Observable<google.maps.places.PlaceResult[]>{
        return Observable.create((observer) => {
            const places = new google.maps.places.PlacesService(map.getMapInstance());
            places.textSearch(
                request,
                (result) => observer.next(result)
            );
        });
    }

    getDetails(map: EzMap, request: google.maps.places.PlaceDetailsRequest): Observable<google.maps.places.PlaceResult> {
        return Observable.create((observer) => {
            const places = new google.maps.places.PlacesService(map.getMapInstance());
            places.getDetails(
                request,
                (result) => observer.next(result)
            )
        });
    }

}