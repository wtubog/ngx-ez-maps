import { PlacesService } from '../../src/ngx-ez-maps/libs/places.service';
import { LocationService } from '../../src/ngx-ez-maps/libs/location.service';
import { EzMapModule } from '../../src/ngx-ez-maps/ez-map.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    EzMapModule.forRoot({
      apiKey: 'AIzaSyBdENUHiCaZPZCh_lEZp7zwq1ekqZLcfz8',
      libraries: [
        'places',
        'geometry'
      ]
    })
  ],
  providers: [
    LocationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
