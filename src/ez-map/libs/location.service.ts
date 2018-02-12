import { NgZone } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LocationService {

  constructor(
    private _zone: NgZone
  ){}

    getCurrentLocation() {
        return Observable.create((observer) => {
            if('geolocation' in navigator){
                navigator.geolocation.getCurrentPosition(
                    (result) => this._zone.runGuarded(() => observer.next(result)),
                    () => observer.next({})
                );
            }
        })
    }
}
