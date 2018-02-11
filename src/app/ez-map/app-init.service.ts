import { Observable } from 'rxjs/Observable';
import { AppConfig, EZ_MAP_CONFIG } from './models/app-config.model';
import { Injectable, Inject } from "@angular/core";

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter } from 'rxjs/operators';

@Injectable()
export class AppInitService {
    private _hasInitialized = new BehaviorSubject<boolean>(false);
    isGooglemapsReady = this._hasInitialized.asObservable().pipe(filter((hasInit) => hasInit));

    constructor(@Inject(EZ_MAP_CONFIG) private conf: AppConfig) {}

    initApp(){
        if(!this._hasInitialized.getValue()){
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.conf.apiKey}&libraries=${this.conf.libraries}&callback=ezMapInit`;


            window['ezMapInit'] = () => {
                this._hasInitialized.next(true);
            }

            document.getElementsByTagName("head")[0].appendChild(script);
        } else {
          console.log('Maps Library has already initialized');
        }
    }
}
