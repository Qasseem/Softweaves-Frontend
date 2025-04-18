import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  forwardRef,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  Icon,
  IconOptions,
  LatLng,
  LatLngBounds,
  Map,
  MapOptions,
  Marker,
  icon,
  latLng,
  marker,
  tileLayer,
} from 'leaflet';
import { HttpService } from 'src/app/core/http/http.service';

@Component({
  selector: 'oc-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LeafletMapComponent),
      multi: true,
    },
  ],
})
export class LeafletMapComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  private _coordinates: { lat: any; lng: any } = {
    lat: 51.505,
    lng: -0.09,
  };
  @Input() mode: 'add' | 'edit' | 'view' = 'add';
  @Input() set coordinates(value) {
    if (value?.lat && value?.lng) {
      this._coordinates = {
        lat: parseFloat(value.lat),
        lng: parseFloat(value.lng),
      };
      const customIconOptions: IconOptions = {
        iconUrl: '../../../../assets/map/marker.svg ',
        iconSize: [25, 41], // size of the icon
        iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
        popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
        // shadowUrl: shadowUrl,
        shadowSize: [41, 41], // size of the shadow
        shadowAnchor: [12, 41], // point of the shadow which will correspond to marker's location
      };
      const customIcon: Icon = icon(customIconOptions);
      const markerOptions = {
        icon: customIcon,
        draggable: this.mode !== 'view',
      };
      setTimeout(() => {
        this.marker = marker(
          { lat: this._coordinates.lat, lng: this._coordinates.lng },
          markerOptions
        ).addTo(this.map);
        this.layers.push(this.marker); // Add marker to layers array
        this.fitMapToBounds();
      }, 100);
    }
  }

  options: MapOptions;
  layers: Marker[] = [];
  maxZoomLevel = 20;
  private marker: Marker;
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  private form: FormGroup;
  private map: Map;
  private resizeObserver: ResizeObserver;
  private initialCoords: LatLng = this.getCountryCooords(); // Default coordinates
  // private initialCoords: LatLng = latLng(25.276987, 55.296249);

  getCountryCooords(): LatLng {
    switch (this.httpService.country) {
      case 'Eg':
        return latLng(26.8206, 30.8025);
      case 'UAE':
        return latLng(25.276987, 55.296249);
      default:
        return latLng(26.8206, 30.8025);
    }
  }

  constructor(
    @Optional() private controlContainer: ControlContainer,
    private elementRef: ElementRef,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.initializeMapOptions();
    if (this.controlContainer) {
      this.form = this.controlContainer.control as FormGroup;
    }
  }

  ngAfterViewInit(): void {
    // Invalidate size to ensure the map is properly sized
    this.initializeResizeObserver();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  initializeMapOptions() {
    this.options = {
      layers: [
        tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          maxZoom: this.maxZoomLevel,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }),
      ],
      zoom: 5,
      center: this.initialCoords,
    };
  }

  onMapClick(event: any) {
    if (this.mode != 'view') {
      const latlng = event.latlng;
      this.setMarker(latlng);
      this.updateFormControls(latlng);
      this.onChange({ lat: latlng.lat, lng: latlng.lng });
      this.onTouched();
    }
  }
  onMapReady(map: Map) {
    this.map = map;
    this.map.invalidateSize();
  }

  setMarker(latlng: LatLng) {
    if (this.marker) {
      this.marker.setLatLng(latlng);
    } else {
      const customIconOptions: IconOptions = {
        iconUrl: '../../../../assets/map/marker.svg ',
        iconSize: [25, 41], // size of the icon
        iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
        popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
        // shadowUrl: shadowUrl,
        shadowSize: [41, 41], // size of the shadow
        shadowAnchor: [12, 41], // point of the shadow which will correspond to marker's location
      };
      const customIcon: Icon = icon(customIconOptions);
      const markerOptions = {
        icon: customIcon,
        draggable: this.mode != 'view',
      };
      this.marker = marker(latlng, markerOptions).addTo(this.map);
      this.layers.push(this.marker); // Add marker to layers array

      if (this.mode === 'view') {
        this.marker.dragging.disable(); // Disable dragging in edit mode
      }
      this.marker.on('dragend', (event) => {
        const position = event.target.getLatLng();
        this.fitMapToBounds();
        this.updateFormControls(position);
        this.onChange({ lat: position.lat, lng: position.lng });
      });
    }
    this.fitMapToBounds();
  }

  updateFormControls(latlng: LatLng) {
    this.form.get('latitude')?.setValue(latlng.lat);
    this.form.get('longitude')?.setValue(latlng.lng);
    // console.log(this.form);
  }

  private fitMapToBounds() {
    if (this.marker) {
      const markerLatLng = this.marker.getLatLng();
      const bounds: LatLngBounds = latLng(
        markerLatLng.lat,
        markerLatLng.lng
      ).toBounds(100); // 50 is a padding value
      this.map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: this.map.getZoom() + 1,
      });
    }
  }

  writeValue(value: any): void {
    if (value) {
      const latlng = latLng(value.lat, value.lng);
      this.setMarker(latlng);
      this.options.center = latlng;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.marker) {
      this.marker.dragging[isDisabled ? 'disable' : 'enable']();
    }
  }
  private initializeResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.map) {
        this.map.invalidateSize();
        this.fitMapToBounds();
      }
    });

    this.resizeObserver.observe(this.elementRef.nativeElement);
  }
}
