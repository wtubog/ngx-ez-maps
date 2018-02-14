import { Output } from '@angular/core';
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

    /**
     * Emits on Map Click event
     */

    @Output()
    mapClicked = new EventEmitter();

    /**
     * Emits when Map has finished loading
     */
    @Output()
    mapReady = new EventEmitter<google.maps.Map>();

    /**
     * Emits when Map bounds changed
     */
    @Output()
    boundsChanged = new EventEmitter<google.maps.LatLngBounds>();

    /**
     * Emits when Map center is changed
     */
    @Output()
    centerChanged = new EventEmitter<google.maps.LatLng>();

    /**
     * Emits on zoomChanged
     */
    @Output()
    zoomChanged = new EventEmitter<number>();

    @Input()
    latitude: number;

    @Input()
    longitude: number;

    @Input()
    zoom: number;

    @Input()
    zoomControl: boolean = true;

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

    @Input()
    mapTypeControl: boolean = false;

    @Input()
    mapTypeControlOptions: google.maps.MapTypeControlOptions;

    @Input()
    streetViewControl: boolean = true;

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
        //Internal Click Event  
        this._mapManager.mapClicked.next();

        //Public marker clicked event
        this.mapClicked.next();
      });
    }

    /**
     * Returns the GoogleMaps Instance
     */

    getMapInstance() {
        return this._mapManager.mapInstance;
    }

    private _buildConfig() {
      console.log(this.streetViewControl);
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
                noClear: this.noClear ? this.noClear : false,
                mapTypeControl: this.mapTypeControl,
                streetViewControl: this.streetViewControl,
                zoomControl: this.zoomControl

            }
        }
    }

}
