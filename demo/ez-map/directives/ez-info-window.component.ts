import { MapManager } from './../map-manager.service';
import { EzMarker } from './ez-marker.component';
import { Host } from '@angular/core';
import { take } from 'rxjs/operators';
import { AppInitService } from './../app-init.service';
import { ElementRef } from '@angular/core';
import { Component, ChangeDetectionStrategy, ViewContainerRef, OnInit, TemplateRef, ContentChild } from '@angular/core';

@Component({
  selector: 'ez-info-window',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EzInfoWindow implements OnInit {

  @ContentChild('infoWindow', {read: ElementRef})
  private _infowWindowTemplate: ElementRef;

  private _infoWindow: google.maps.InfoWindow;

  constructor(
    private _as: AppInitService,
    private _mapManager: MapManager
  ) {}

  ngOnInit() {
    this._as.isGooglemapsReady.pipe(take(1))
      .subscribe(() => {
          this._infoWindow = new google.maps.InfoWindow({
            content: this._infowWindowTemplate.nativeElement
          })
      });

    this._mapManager.mapClicked.asObservable()
      .subscribe(() => this.close());

    this._mapManager.markerClicked.asObservable()
      .subscribe(() => this.close());
  }

  open(map, marker) {
    this._infoWindow.open(map, marker);
  }

  close() {
    this._infoWindow.close();
  }

}
