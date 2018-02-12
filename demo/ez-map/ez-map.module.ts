import { EzInfoWindow } from './directives/ez-info-window.component';
import { EzMarker } from './directives/ez-marker.component';
import { LocationService } from './libs/location.service';
import { GoogleMaps } from './libs/google-maps';
import { EzMap } from './directives/ez-map.component';
import { AppInitService } from './app-init.service';
import { AppConfig, EZ_MAP_CONFIG } from './models/app-config.model';
import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';

export function libInit(as: AppInitService){
    return () => as.initApp();
}

const reExports = [
    EzMap,
    EzMarker,
    EzInfoWindow
]

// @dynamic
@NgModule({
    declarations: reExports,
    exports: reExports,
    imports: [
        CommonModule
    ]
})
export class EzMapModule {
    static forRoot(config: AppConfig): ModuleWithProviders{
        return {
            ngModule: EzMapModule,
            providers: [
                AppInitService,
                {
                    provide: EZ_MAP_CONFIG,
                    useValue: config
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: libInit,
                    deps: [
                        AppInitService,
                        EZ_MAP_CONFIG
                    ],
                    multi: true
                },
                GoogleMaps
            ]
        }
    }
}
