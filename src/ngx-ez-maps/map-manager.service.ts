import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

export class MapManager {
  mapInstance: google.maps.Map;

  markers: google.maps.Marker[] = [];

  mapClicked = new Subject();

  markerClicked = new Subject<number>();

  mapInstanceReady = new BehaviorSubject<boolean>(false);
}
