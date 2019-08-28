import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Host,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { AppInitService } from './../app-init.service';
import { MapManager } from './../map-manager.service';
import { EzMarkerComponent } from './ez-marker.component';

@Component({
  selector: 'ez-info-window',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EzInfoWindowComponent implements OnInit, OnDestroy {
  @ContentChild('infoWindow', { read: ElementRef, static: true })
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
    @Host() private _marker: EzMarkerComponent,
    private _zone: NgZone
  ) {}

  ngOnInit() {
    this._as.isGooglemapsReady.pipe(take(1)).subscribe(() => {
      console.log(this.isOpen);
      this._infoWindow = this._zone.runOutsideAngular(() => {
        return new google.maps.InfoWindow({
          content: this._infowWindowTemplate.nativeElement
        });
      });
      if (this.isOpen) {
        this.open();
      }
      this._bindInfoWindowEvents();
    });

    this._mapClickListener$ = this._mapManager.mapClicked
      .asObservable()
      .subscribe(() => this.closeOnMapClicked && this.close());

    this._markerClickListener$ = this._mapManager.markerClicked
      .asObservable()
      .subscribe(id => {
        if (this.closeWhenOthersOpened) {
          this.close();
        }
        if (this._marker.markerId === id) {
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
    if (this._isOpen) {
      this.onClose.next();
    }
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
      this.close();
    });
  }
}
