import { AppInitService } from './../app-init.service';
import { Injectable, ElementRef, NgZone } from "@angular/core";
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import {} from '@types/google-maps';

@Injectable()
export class GoogleMaps {
    constructor(
        private _as: AppInitService,
        private _zone: NgZone
    ) {}

    createMap(elem: ElementRef, conf: google.maps.MapOptions): Observable<google.maps.Map>{
        return this._as.isGooglemapsReady
        .pipe(
            map(() => 
                this._zone.runOutsideAngular(() => new google.maps.Map(elem.nativeElement, conf)))
        );
    }

    createMarker(config: google.maps.MarkerOptions) {
        
        return this._as.isGooglemapsReady
        .pipe(map(() => 
            this._zone.runOutsideAngular(() => new google.maps.Marker(config)))
        );
    }
}
