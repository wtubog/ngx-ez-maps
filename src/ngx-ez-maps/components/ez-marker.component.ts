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
     * 
     * Public use marker clicked event
     */
    @Output()
    markerClicked = new EventEmitter<void>();

    constructor(
        private _gm: GoogleMaps,
        private _mapManager: MapManager
    ) {}

    ngOnInit() {
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
              console.log(this._markerId);
              this._bindMarkerEvents();
          });
    }

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

    private _bindMarkerEvents() {
      this._markerInstance.addListener('click', () => {
        // For internal marker clicked event
        this._mapManager.markerClicked.next(this._markerId);
        // For public marker clicked event 
        this.markerClicked.next();
      });
    }

    get markerId(){
        return this._markerId;
    }

}
