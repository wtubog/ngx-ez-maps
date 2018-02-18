<<<<<<< HEAD
import { OnDestroy, NgZone } from '@angular/core';
=======
import { EventEmitter, Output } from '@angular/core';
import { OnDestroy } from '@angular/core';
>>>>>>> a3dd96b05cc2c6f7122315fd602ffb053232836a
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
  private _isOpen = false;

  /**
   * Input to change if you want the info window to be initially opened when instantiated
   */

  @Input()
  isOpen = false;

  /**
   * Closes the InfoWindow when user clicks on the map
   */

  @Input()
  closeOnMapClicked = true;

  /**
   * Closes the Info window if other Marker's InfoWindow is open
   */

  @Input()
  closeWhenOthersOpened = true;

  /**
   * Emits when the info window is closed
   */

  @Output()
  onClose = new EventEmitter();

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
          this._bindInfoWindowEvents();
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

  /**
   * Opens the InfoWindow
   */

  open() {
    this._isOpen = true;
    this._infoWindow.open(
        this._mapManager.mapInstance,
        this._mapManager.markers[this._marker.markerId]
    );
  }

  /**
   * Closes the InfoWindow
   */

  close() {
    this._isOpen && this.onClose.next();
    this._isOpen = false;
    this._infoWindow.close();
  }

  ngOnDestroy() {
    this._mapClickListener$.unsubscribe();
    this._markerClickListener$.unsubscribe();
    this._infoWindow = null;
  }

  private _bindInfoWindowEvents() {
    this._infoWindow.addListener('closeclick', () => {
      this.close()
    })
  }

}
