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
    ]
})
export class EzMap implements OnInit {

    @ViewChild('map')
    private _mapEl: ElementRef;

    private _mapInstance: google.maps.Map;

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
    markersTempRef: TemplateRef<any>;

    private _mapConfig: google.maps.MapOptions;

    private _defaultConfig: google.maps.MapOptions = {
        zoom: 12,
        center: { lat: 120.9842, lng: 14.5995 },
    }

    constructor(private _gmap: GoogleMaps) {}

    ngOnInit() {
        this._buildConfig();
        this._gmap.createMap(this._mapEl, this._mapConfig).subscribe((map) => {
            this._mapInstance = map;
            this.mapReady.next(this._mapInstance);
            this._bindMapEvents();
        });
    }

    private _bindMapEvents() {
        this._mapInstance.addListener('bounds_changed', () => {
            this.boundsChanged.next(this._mapInstance.getBounds());
        });

        this._mapInstance.addListener('center_changed', () => {
            this.centerChanged.next(this._mapInstance.getCenter());
        });

        this._mapInstance.addListener('zoom_changed', () => {
            this.zoomChanged.next(this._mapInstance.getZoom());
        });
    }

    getMapInstance() {
        return this._mapInstance;
    }

    private _buildConfig() {
        this._mapConfig = {
            ...this._defaultConfig,
            ...{
                center: { lat: this.latitude, lng: this.longitude },
                zoom: this.zoom
            }
        }
    }

    ngDoCheck() {
        console.log("map checking...")
    }

    ngOnChanges(changes: SimpleChange) {
      console.log(changes);
    }

}
