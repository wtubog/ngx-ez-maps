import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import {} from '@types/google-maps';

export class MapManager {

  mapClicked = new Subject();

  markerClicked = new Subject();

  mapInstanceReady = new BehaviorSubject<boolean>(false);

}
