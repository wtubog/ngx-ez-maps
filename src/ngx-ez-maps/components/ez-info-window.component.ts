import { OnDestroy, NgZone } from '@angular/core';
import { MapManager } from './../map-manager.service';
import { EzMarker } from './ez-marker.component';
import { Host, Input, SkipSelf } from '@angular/core';
import { take } from 'rxjs/operators';
import { AppInitService } from './../app-init.service';
import { ElementRef } from '@angular/core';
import { Component, ChangeDetectionStrategy, ViewContainerRef, OnInit, TemplateRef, ContentChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ez-info-window',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EzInfoWindow implements OnInit, OnDestroy {

  @ContentChild('infoWindow', {read: ElementRef})
  private _infowWindowTemplate: ElementRef;

  private _infoWindow: google.maps.InfoWindow;

  @Input()
  isOpen = false;

  @Input()
  closeOnMapClicked = true;

  @Input()
  closeWhenOthersOpened = true;

  private _mapClickListener$: Subscription;
  private _markerClickListener$: Subscription;

  constructor(
    private _as: AppInitService,
    private _mapManager: MapManager,
    @Host() private _marker: EzMarker,
    private _zone: NgZone
  ) {}

  ngOnInit() {
    this._as.isGooglemapsReady
      .pipe(take(1))
      .subscribe(() => {
        console.log(this.isOpen);
          this._infoWindow = this._zone.runOutsideAngular(() => {
            return new google.maps.InfoWindow({
              content: this._infowWindowTemplate.nativeElement
            })
          });
          this.isOpen && this.open();
      });

    this._mapClickListener$ = this._mapManager.mapClicked.asObservable()
      .subscribe(() =>
        this.closeOnMapClicked && this.close());

    this._markerClickListener$ = this._mapManager.markerClicked.asObservable()
      .subscribe((id) => {
        this.closeWhenOthersOpened && this.close();
        if(this._marker.markerId == id){
          this.open();
        }
    });
  }

  open() {
    this._infoWindow.open(
        this._mapManager.mapInstance,
        this._mapManager.markers[this._marker.markerId]
    );
  }

  close() {
    this._infoWindow.close();
  }

  ngOnDestroy() {
    this._mapClickListener$.unsubscribe();
    this._markerClickListener$.unsubscribe();
    this._infoWindow = null;
  }

}
