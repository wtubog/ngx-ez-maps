import { MapManager } from './../map-manager.service';
import { Subject } from 'rxjs/Subject';
import { EzInfoWindow } from './ez-info-window.component';
import { map, switchMap, filter, take } from 'rxjs/operators';
import { GoogleMaps } from './../libs/google-maps';
import { EzMap } from './ez-map.component';
import { Component, Directive, OnInit, Host, Input, OnDestroy, ChangeDetectionStrategy, ViewChild, ContentChild, Output, ChangeDetectorRef, EventEmitter } from "@angular/core";

import { } from '@types/google-maps';

@Component({
    selector: 'ez-marker',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush
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

    private _markerId: number;
    
    /**
     * Fires when a marker is clicked
     * Public use marker clicked event
     */
    @Output()
    markerClicked = new EventEmitter<EzMarker>();

    constructor(
        private _gm: GoogleMaps,
        private _mapManager: MapManager
    ) {}

    ngOnInit() {
        this._initializeMarker();
    }

    /**
     * Create / Initialize the Marker instance
     */

    private _initializeMarker() {
        this._mapManager.mapInstanceReady
          .asObservable()
          .pipe(
            filter((isReady) => isReady),
            take(1),
            switchMap(() => {
              this._buildConfig();
              return this._gm.createMarker(this._markerConfig);
            }))
          .subscribe((marker) => {
              this._markerId = this._mapManager.markers.length;
              this._markerInstance = marker;
              this._mapManager.markers.push(this._markerInstance);
              this._bindMarkerEvents();
          });
    }

    /**
     * Builds the configuration needed to instantiate the Maker
     * @return void
     */

    private _buildConfig() {
        const animation = this.animation ? google.maps.Animation[this.animation] : "" ;
        this._markerConfig = {
            map: this._mapManager.mapInstance,
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

    /**
     * Starts listening on Marker Events
     */

    private _bindMarkerEvents() {
      this._markerInstance.addListener('click', () => {
        // For internal marker clicked event
        this._mapManager.markerClicked.next(this._markerId);
        // For public marker clicked event 
        this.markerClicked.next(this);
      });
    }

    /**
     * Internal use only
     */

    get markerId(){
        return this._markerId;
    }

    getAnimation(): google.maps.Animation {
        return this._markerInstance.getAnimation();
    }

    /**
     * Start an animation. Any ongoing animation will be cancelled. 
     * Currently supported animations are: BOUNCE, DROP. 
     * Passing in null will cause any animation to stop.
     */

    setAnimation(animation: 'DROP' | 'BOUNCE' | null): void {
        const anim = animation ? google.maps.Animation[animation] : null;
        this._markerInstance.setAnimation(anim);
    }

    /**
     * Sets or Updates the position of a Marker on the Map
     * @param latlang
     */

    setPosition(latLng: google.maps.LatLngLiteral) {
        this._markerInstance.setPosition(latLng);
    }

    /**
     * Get the position of the Marker
     * @return LatLng object
     */

    getPosition(): google.maps.LatLng{
        return this._markerInstance.getPosition();
    }

}
