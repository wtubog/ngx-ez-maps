# RxJS Powered Google Maps for Angular

A relatively easy to use google maps

## Installation

```bash
$ npm install ngx-ez-maps --save

```

## Work in progress

This library is under heavy development and has only basic GoogleMap's functionality, feel free to contribute :)

### To do list

- Testing 
- Everything under the [GooleMap Docs](https://developers.google.com/maps/documentation/javascript/)

## Basic Usage

This basic app instantiates the google maps ( centered on Manila, Philippines in this case :) ) with a marker and an InfoWindow. When the marker is clicked, set the animation to `BOUNCE` and when you click anywhere on the Map, Animation on the Marker will be removed

Import `EzMapModule` to your root module:

```typescript
...
@NgModule(
    ...,
    imports: [
        EzMapModule.forRoot({
            apiKey: "API_KEY_HERE",
            libraries?: [
                'lib1',
                'lib2'
            ]
        })
    ]
    ...
)
```

For FeatureModule, just import without the `.forRoot` static method call.

...on your component:

```typescript
...
import { EzMap, EzMarker, EzInfoWindow }
@Component({
    selector: "app-root"
})
export class AppComponent implements OnInit {
    selectedMarker: EzMarker;

    pos = {
        longitude: 121.1924108,
        latitude: 14.5964957
    }

    onMapReady(map: EzMap) {
        // do something with the map instance :D
    }

    // Marker click returns an instance of EzMarker
    onMarkerClicked(marker: EzMarker){
        this.selectedMarker = marker;
        this.selectedMarker.setAnimation('BOUNCE');
    }

    
    onMapClicked(){
        this.selectedMarker.setAnimation(null);
    }

}
```

```html
<ez-map
    [latitude]="pos.latitude"
    [longitude]="pos.longitude"
    [zoom]="12"
    [gestureHandling]="'greedy'"
    [streetViewControl]="false"
    [zoomControl]="false"
    (mapReady)="onMapReady($event)"
    (mapClicked)="onMapClicked($event)"
    #map>

    <ez-marker
        [longitude]="pos.longitude"
        [latitude]="pos.latitude"
        (markerClicked)="onMarkerClicked($event)">

        <ez-info-window
            [isOpen]="true"
            [closeOnMapClicked]="false"
            [closeWhenOthersOpened]="false">

            <!-- Required, put your templates inside #infoWindow Template Ref -->
            <div #infoWindow>
                You are here!
            </div>

        </ez-info-window>

    </ez-marker>

</ez-map>

```

## LocationService

EzMaps is shipped with helper libraries like `LocationService`

`LocationService` encapsulates `navigator.geolocation`'s methods with RxJS (because we all love observables) 

### Methods
- getCurrentLocation
- watchPosition

### Usage

Just provide the service:

```typescript

@NgModule({
    ...
    ...
    providers: [LocationService]
})
export class CoreModule {}

```

And on your component you'll do, for example, you want to get the current location:

```typescript

@Component(...)
export class AppComponent {
    constructor(private _locationService: LocationService) {}

    ngOnInit(){
        // getCurrentLocation returns a Position object. https://developer.mozilla.org/en-US/docs/Web/API/Position
        this._locationService.getCurrentLocation()
            .subscribe((pos: Position) => {
                // do something cool with the output
            })
    }
}

```

## PlacesService

`PlacesService` encapsulates GoogleMaps' Places Library.

### Methods

- nearbySearch
- textSearch
- getDetails

For more information about the parameters for these methods, check out the awesome GoogleMaps [docs](https://developers.google.com/maps/documentation/javascript/places)

Start by providing the service: 

### Usage

```typescript

@NgModule({
    ...
    ...
    providers: [PlacesService]
})
export class CoreModule {}

```

Use its methods within `onMapReady` only because each method within the `PlacesService` would need `map` instance

```typescript

@Component({
    ...
    template: `
        <ez-map (mapReady)="onMapReady($event)"></ez-map>
    `
})
export class AppComponent {

    pos = {
        lng: 121.1924108,
        lat: 14.5964957
    };

    constructor(private _placesService: PlacesService) {}

    onMapReady(map: google.maps.Map){

        this._places.nearbySearch(map, {
            keyword: "store",
            radius: 5000,
            location: this.pos
        }).subscribe((data) => {
            // do something with the data
        });

    }
}

```
