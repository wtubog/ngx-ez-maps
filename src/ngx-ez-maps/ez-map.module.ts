import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { AppInitService } from './app-init.service';
import { EzInfoWindowComponent } from './components/ez-info-window.component';
import { EzMapComponent } from './components/ez-map.component';
import { EzMarkerComponent } from './components/ez-marker.component';
import { GoogleMaps } from './libs/google-maps';
import { AppConfig, EZ_MAP_CONFIG } from './models/app-config.model';

export function libInit(as: AppInitService) {
  return () => as.initApp();
}

const reExports = [
  EzMapComponent,
  EzMarkerComponent,
  EzInfoWindowComponent
];

@NgModule({
  declarations: reExports,
  exports: reExports,
  imports: [CommonModule]
})
export class EzMapModule {
  static forRoot(config: AppConfig): ModuleWithProviders {
    return {
      ngModule: EzMapModule,
      providers: [
        {
          provide: EZ_MAP_CONFIG,
          useValue: config
        },
        {
          provide: APP_INITIALIZER,
          useFactory: libInit,
          deps: [AppInitService, EZ_MAP_CONFIG],
          multi: true
        },
        AppInitService,
        GoogleMaps
      ]
    };
  }
}
