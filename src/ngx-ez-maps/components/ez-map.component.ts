import { take } from 'rxjs/operators';
import { MapManager } from './../map-manager.service';
import { GoogleMaps } from './../libs/google-maps';
import { AppInitService } from './../app-init.service';
import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input, ChangeDetectionStrategy, TemplateRef } from '@angular/core';

import { } from '@types/google-maps';
import { Subject } from 'rxjs/Subject';
import { SimpleChange } from '@angular/core';
import { OnChanges } from '@angular/core';

@Component({
    selector: 'ez-map',
    template: `
        <div id='map' #map>
            <ng-content></ng-content>
        </div>
    `,
    styles: [
        `
            #map{
                width: 100%;
                height: 100%;
                position: relative
            }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
      MapManager
    ]
})
export class EzMap implements OnInit {

    @ViewChild('map')
    private _mapEl: ElementRef;

    @Output()
    mapReady = new EventEmitter<google.maps.Map>();

    @Output()
    boundsChanged = new EventEmitter<google.maps.LatLngBounds>();

    @Output()
    centerChanged = new EventEmitter<google.maps.LatLng>();

    @Output()
    zoomChanged = new EventEmitter<number>();

    @Input()
    latitude: number;

    @Input()
    longitude: number;

    @Input()
    zoom: number;

    @Input()
    zoomControl: boolean;

    @Input()
    gestureHandling: 'cooperative' | 'greedy' | 'none' | 'auto' = 'auto';

    @Input()
    center: { lat: number, lng: number };

    @Input()
    disableDoubleClickZoom: boolean;

    @Input()
    fullScreenControl: boolean;

    @Input()
    heading: number;

    @Input()
    keyboardShortcuts: boolean;

    @Input()
    maxZoom: number;

    @Input()
    minZoom: number;

    @Input()
    noClear: boolean;

    private _mapConfig: google.maps.MapOptions;

    private _defaultConfig: google.maps.MapOptions = {
        zoom: 12,
        center: { lat: 120.9842, lng: 14.5995 },
    }

    constructor(
      private _gmap: GoogleMaps,
      private _mapManager: MapManager
    ) {}

    ngOnInit() {
        this._buildConfig();
        this._gmap.createMap(this._mapEl, this._mapConfig)
          .pipe(take(1))
          .subscribe((map) => {
              this._mapManager.mapInstance = map;
              this.mapReady.next(this._mapManager.mapInstance);
              this._mapManager.mapInstanceReady.next(true);
              this._bindMapEvents();
          });
    }

    private _bindMapEvents() {
      this._mapManager.mapInstance.addListener('bounds_changed', () => {
          this.boundsChanged.next(this._mapManager.mapInstance.getBounds());
      });

      this._mapManager.mapInstance.addListener('center_changed', () => {
          this.centerChanged.next(this._mapManager.mapInstance.getCenter());
      });

      this._mapManager.mapInstance.addListener('zoom_changed', () => {
          this.zoomChanged.next(this._mapManager.mapInstance.getZoom());
      });

      this._mapManager.mapInstance.addListener('click', () => {
          this._mapManager.mapClicked.next();
      });
    }

    getMapInstance() {
        return this._mapManager.mapInstance;
    }

    private _buildConfig() {
        this._mapConfig = {
            ...this._defaultConfig,
            ...{
                center: { lat: this.latitude, lng: this.longitude },
                zoom: this.zoom,
                minZoom: this.minZoom ? this.minZoom : 0,
                maxZoom: this.maxZoom ? this.maxZoom : 0,
                gestureHandling: this.gestureHandling ? this.gestureHandling : 'auto',
                disableDoubleClickZoom: this.disableDoubleClickZoom ? this.disableDoubleClickZoom : false,
                fullscreenControl: this.fullScreenControl ? this.fullScreenControl : false,
                heading: this.heading ? this.heading : null,
                noClear: this.noClear ? this.noClear : false

            }
        }
    }

    ngDoCheck() {
        console.error("map checking...")
    }

    ngOnChanges(changes: SimpleChange) {
      console.log(changes);
    }

}
