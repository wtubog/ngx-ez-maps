import { map } from 'rxjs/operators';
import { GoogleMaps } from './../libs/google-maps';
import { EzMap } from './ez-map.component';
import { Directive, OnInit, Host, Input, OnDestroy } from "@angular/core";

import { } from '@types/google-maps';

@Directive({
    selector: 'ez-marker'
})
export class EzMarker implements OnInit, OnDestroy {

    @Input()
    latitude: number;

    @Input()
    longitude: number;

    @Input()
    animation: string;

    private _markerConfig: google.maps.MarkerOptions;

    private _markerInstance: google.maps.Marker;
        
    constructor(
        @Host() private _map: EzMap,
        private _gm: GoogleMaps
    ) {}
    
    ngOnInit() {
        this._buildConfig();
        this._gm.createMarker(this._markerConfig)
            .subscribe((marker) => {
                this._markerInstance = marker;
            });
    }

    private _buildConfig() {
        const animation = this.animation == 'DROP' ? google.maps.Animation.DROP : google.maps.Animation.BOUNCE
        this._markerConfig = {
            map: this._map.getMapInstance(),
            position: {
                lat: this.latitude,
                lng: this.longitude
            },
            animation: animation
        }
    }

    ngOnDestroy() {
        this._markerInstance.setMap(null);
    }
}