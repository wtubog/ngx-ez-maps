import { Observable } from 'rxjs/Observable';

export class LocationService {

    getCurrentLocation() {
        return Observable.create((observer) => {
            if('geolocation' in navigator){    
                navigator.geolocation.getCurrentPosition(
                    (result) => observer.next(result),
                    () => observer.next({})
                );
            }
        })
    }
}