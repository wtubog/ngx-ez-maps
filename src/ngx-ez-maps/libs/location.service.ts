import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NgZone } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LocationService {

    private _positionId;

    private _position = new BehaviorSubject<Position>(null);

    private _position$ = this._position.asObservable();

  constructor(
    private _zone: NgZone
  ){}

    getCurrentLocation(options?: PositionOptions): Observable<Position> {
        return Observable.create((observer) => {
            if('geolocation' in navigator){
                navigator.geolocation.getCurrentPosition(
                    (result) => this._zone.runGuarded(() => observer.next(result)),
                    () => observer.next({}),
                    options
                );
            } else {
                observer.error();
            }
        })
    }

    watchPosition(): Observable<Position> {
        if(this._positionId){
            return this._position$;
        } else {
            if('geolocation' in navigator){
                this._positionId = navigator.geolocation.watchPosition(
                    (data) => this._position.next(data),
                    (err) => this._position.error(err)
                )
            } else {
                this._position.error("Geolocation is not supported");
            }

            return this._position$;
        }
    }
    
    clearWatch(){
        if(this._positionId){
            this._position.complete();
            navigator.geolocation.clearWatch(this._positionId);
        }
    }
}
