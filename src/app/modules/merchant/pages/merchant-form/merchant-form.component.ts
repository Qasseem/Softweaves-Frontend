import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, takeWhile } from 'rxjs';
import { TerminalService } from 'src/app/modules/terminal/services/terminal.service';
import { MerchantService } from '../../services/merchant.service';

@Component({
  selector: 'oc-merchant-form',
  templateUrl: './merchant-form.component.html',
  styleUrls: ['./merchant-form.component.scss'],
})
export class MerchantFormComponent implements OnInit, OnDestroy {
  alive: boolean = true;
  form: FormGroup;
  categories = [];
  citiesList = [];
  regionsList = [];
  zonesList = [];
  id;
  details: any;
  orignalZones = [];
  orignalCities = [];
  formType = 'add';
  coordinates;
  constructor(
    private fb: FormBuilder,
    private merchantService: MerchantService,
    private terminalService: TerminalService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formType = this.route.snapshot.data.type;
    const arabicLetterPattern = new RegExp(/^[\u0600-\u06FF0-9\s!@#$%^&*()]+$/);
    const englishLetterPattern = new RegExp(/^[a-zA-Z0-9\s!@#$%^&*()]+$/);

    this.form = this.fb.group({
      merchantNameEN: [
        '',
        [Validators.required, Validators.pattern(englishLetterPattern)],
      ],
      merchantNameAR: [
        '',
        [Validators.required, Validators.pattern(arabicLetterPattern)],
      ],
      userName: ['', Validators.required],
      categoryId: [null, Validators.required],
      merchantId: [null, Validators.required],
      id: [null],
      phoneNumber: [null, Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      regionId: [null, Validators.required],
      cityId: [null, Validators.required],
      zoneId: [null, Validators.required],
      address: [null, Validators.required],
      landMark: [null],
    });
  }

  ngOnInit() {
    if (this.formType == 'edit') {
      this.id = this.route.snapshot.params.id || null;
      if (this.id) {
        this.getItemDetails();
      }
    }

    this.getAllMerchantCategories();
    this.GetMerchantDropdownValues();
    combineLatest([
      this.form.get('latitude').valueChanges,
      this.form.get('longitude').valueChanges,
    ]).subscribe({
      next: ([lat, lng]) => {
        if (lat && lng) {
          this.terminalService.GetAddressFromLatLng(lat, lng).subscribe({
            next: (res: any) => {
              if (this.formType == 'add')
                this.form.get('address').patchValue(res.address.LongLabel);
            },
          });
        }
      },
    });
  }
  getItemDetails() {
    this.merchantService
      .GetDetails(this.id)
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.details = resp.data;
            if (this.details) {
              this.form.patchValue(this.details);
              this.coordinates = {
                lat: this.form.get('latitude').value,
                lng: this.form.get('longitude').value,
              };
              // this.form.updateValueAndValidity();
            }
          }
        },
      });
  }

  getAllMerchantCategories() {
    this.merchantService
      .GetAllMerchantCategories()
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.categories = resp.data;
          }
        },
      });
  }
  onSubmit() {}
  get f() {
    return this.form.controls;
  }
  submit() {
    let obj = this.form.value;
    if (!this.id) {
      delete obj.id;
    }
    this.merchantService
      .Save(this.form.value)
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.backToList();
          }
        },
      });
  }
  backToList() {
    this.router.navigate(['main/merchant/list']);
  }

  GetMerchantDropdownValues() {
    const regionControl = this.form.get('regionId');

    this.terminalService
      .GetAllRegions()
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.regionsList = resp.data;
            // regionControl.setValue(resp.data[0].id);
          }
        },
      });
    const cityControl = this.form.get('cityId');
    regionControl.valueChanges.subscribe({
      next: (regionId) => {
        if (regionId) {
          this.terminalService
            .GetAllCities(regionId)
            .pipe(takeWhile(() => this.alive))
            .subscribe({
              next: (resp) => {
                if (resp.success) {
                  this.citiesList = resp.data;
                  this.orignalCities = resp.data;
                  // cityControl.setValue(resp.data[0].id);
                }
              },
            });
        }
      },
    });
    cityControl.valueChanges.subscribe({
      next: (cityId) => {
        if (cityId) {
          this.terminalService
            .GetAllZones(cityId)
            .pipe(takeWhile(() => this.alive))
            .subscribe((resp) => {
              if (resp.success) {
                this.zonesList = resp.data;
                this.orignalZones = resp.data;
                // if(this.zonesList.length)
                // this.form.get('zoneId').setValue(this.zonesList[0].id);
              }
            });
        }
      },
    });
  }

  cityChanged(event) {
    this.form.controls.zoneId.setValue(null);
    this.zonesList = this.orignalZones;
    if (event) {
      this.zonesList = this.zonesList.filter((x) => x.parentId == event.value);
    }
  }

  regionChanged(event) {
    this.form.controls.cityId.setValue(null);
    this.form.controls.zoneId.setValue(null);
    this.citiesList = this.orignalCities;
    if (event) {
      this.citiesList = this.citiesList.filter(
        (x) => x.parentId == event.value
      );
    }
  }
  formatLngLat(string) {
    return string !== null ? parseInt(string).toFixed(6).toString() : '-';
  }
  ngOnDestroy() {
    this.alive = false;
  }
}
