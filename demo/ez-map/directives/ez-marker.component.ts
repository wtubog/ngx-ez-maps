import { MapManager } from './../map-manager.service';
import { Subject } from 'rxjs/Subject';
import { EzInfoWindow } from './ez-info-window.component';
import { map, switchMap, filter, take } from 'rxjs/operators';
import { GoogleMaps } from './../libs/google-maps';
import { EzMap } from './ez-map.component';
import { Component, Directive, OnInit, Host, Input, OnDestroy, ChangeDetectionStrategy, ViewChild, ContentChild, Output, ChangeDetectorRef } from "@angular/core";

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

    @Output()
    markerClicked = new Subject();

    @ContentChild(EzInfoWindow)
    private _infoWin: EzInfoWindow;

    private _markerConfig: google.maps.MarkerOptions;

    private _markerInstance: google.maps.Marker;

    constructor(
        @Host() private _map: EzMap,
        private _gm: GoogleMaps,
        private _mapManager: MapManager,
        private _cdRef: ChangeDetectorRef
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
              console.log("Marker created!");
              this._markerInstance = marker;
              this._bindMarkerEvents();
          });
    }

    private _buildConfig() {
        // const animation = this.animation == 'DROP' ? google.maps.Animation.DROP : google.maps.Animation.BOUNCE
        console.log('Building Marker config...');
        console.log(this._map.getMapInstance());
        this._markerConfig = {
            map: this._map.getMapInstance(),
            position: {
                lat: this.latitude,
                lng: this.longitude
            }
        }
    }

    ngOnDestroy() {
        this._markerInstance.setMap(null);
    }

    private _bindMarkerEvents() {
      this._markerInstance.addListener('click', () => {
        this._mapManager.markerClicked.next();
        if(this._infoWin){
          this._infoWin.open(this._map.getMapInstance(), this._markerInstance);
        }
      });
    }

    ngAfterContentInit(){

    }

    get map() {
      return this._map.getMapInstance();
    }

    get marker(){
      return this._markerInstance;
    }
}
