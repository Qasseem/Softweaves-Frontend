import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, take, takeWhile } from 'rxjs';
import { TerminalService } from '../../services/terminal.service';
import { MerchantService } from 'src/app/modules/merchant/services/merchant.service';

@Component({
  selector: 'oc-terminal-form',
  templateUrl: './terminal-form.component.html',
  styleUrls: ['./terminal-form.component.scss'],
})
export class TerminalFormComponent implements OnInit, AfterViewInit, OnDestroy {
  alive = true;
  terminalForm: FormGroup;
  id;
  details: any;

  citiesList = [];
  regionsList = [];
  zonesList = [];
  errandChannelsList = [];
  posList = [];

  allMerchantList = [];
  orignalZones = [];
  orignalCities = [];
  formType = 'add';
  coordinates = { lng: null, lat: null };
  merchantId: any;
  merchanDetailstData: any;

  constructor(
    private fb: FormBuilder,
    private service: TerminalService,
    private router: Router,
    private route: ActivatedRoute,
    private merchantService: MerchantService
  ) {
    this.formType = this.route.snapshot.data.type;
  }
  getMerchantData(disableMerchantDdl = false) {
    if (this.merchantId && !this.id) {
      this.merchantService
        .GetDetails(this.merchantId)
        .pipe(take(1))
        .subscribe((resp) => {
          if (resp.success) {
            this.merchanDetailstData = resp.data;
            this.fillMerchantFormData(disableMerchantDdl);
          }
        });
    }
  }
  fillMerchantFormData(disableMerchantDdl = false) {
    this.terminalForm.controls.merchantId.setValue(this.merchanDetailstData.id);
    this.terminalForm.controls.latitude.setValue(
      this.merchanDetailstData.latitude
    );
    this.terminalForm.controls.longitude.setValue(
      this.merchanDetailstData.longitude
    );
    this.terminalForm.controls.regionId.setValue(
      this.merchanDetailstData.regionId
    );
    this.terminalForm.controls.cityId.setValue(this.merchanDetailstData.cityId);
    this.terminalForm.controls.zoneId.setValue(this.merchanDetailstData.zoneId);
    this.terminalForm.controls.address.setValue(
      this.merchanDetailstData.address
    );
    this.terminalForm.controls.landMark.setValue(
      this.merchanDetailstData.landMark
    );
    this.terminalForm.controls.phoneNumber.setValue(
      this.merchanDetailstData.phoneNumber
    );

    disableMerchantDdl ? this.terminalForm.controls.merchantId.disable() : '';
    if (
      this.merchanDetailstData.longitude &&
      this.merchanDetailstData.latitude
    ) {
      this.coordinates.lng = parseFloat(this.merchanDetailstData.longitude);
      this.coordinates.lat = parseFloat(this.merchanDetailstData.latitude);
      this.coordinates = { ...this.coordinates };
    }
    this.terminalForm.updateValueAndValidity();
  }

  merchantChanged(event) {
    if (event?.id) {
      this.merchantId = event?.id;
      this.getMerchantData();
    }
  }

  ngOnInit() {
    if (this.formType == 'edit') {
      this.id = this.route.snapshot.params.id || null;
      if (this.id) {
        this.getItemDetails();
      }
    }
    this.getTerminalDropDownsData();
    this.terminalForm = this.fb.group({
      merchantId: [null, Validators.required],
      terminalId: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30),
          Validators.pattern(/^\d{1,30}$/),
        ],
      ],
      phoneNumber: [
        null,
        [
          Validators.minLength(10),
          Validators.maxLength(14),
          Validators.pattern(/^\d{10,14}$/),
        ],
      ],
      errandChannelId: [null, Validators.required],
      posTypeId: [null, Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      regionId: [null, Validators.required],
      latitudeInput: [null],
      longitudeInput: [null],
      cityId: [null, Validators.required],
      zoneId: [null, Validators.required],
      address: [null],
      landMark: [null],
      id: [null],
    });
    combineLatest([
      this.terminalForm.get('latitude').valueChanges,
      this.terminalForm.get('longitude').valueChanges,
    ]).subscribe({
      next: ([lat, lng]) => {
        if (lat && lng) {
          this.service.GetAddressFromLatLng(lat, lng).subscribe({
            next: (res: any) => {
              if (this.formType == 'add')
                this.terminalForm
                  .get('address')
                  .patchValue(res.address.LongLabel);
            },
          });
        }
      },
    });

    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.merchantId = params['merchantId'];
    });
    this.getMerchantData(true);
  }

  ngAfterViewInit(): void {
    // this.showMap = true;
  }

  getTerminalDropDownsData() {
    this.service
      .GetAllRegions()
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.regionsList = resp.data;
          }
        },
      });

    this.service
      .GetAllCities(0)
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.citiesList = resp.data;
            this.orignalCities = resp.data;
          }
        },
      });

    // this.service
    //   .GetAllMerchantDropDown()
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe({
    //     next: (resp) => {
    //       if (resp.success) {
    //         resp.data.forEach((item) => {
    //           item.searchKey =
    //             (item?.id ?? '') +
    //             (item.nameEn ?? '') +
    //             (item?.nameAr ?? '') +
    //             (item?.merchantId ?? '');
    //         });

    //         this.allMerchantList = resp.data;
    //         this.route.queryParams.subscribe((params) => {
    //           if (params.hasOwnProperty('merchantId')) {
    //             const merchantId = params['merchantId'];
    //             if (merchantId) {
    //               const selectedMerchant = this.allMerchantList.find(
    //                 (merchant) => merchant.id == merchantId // Use == for loose comparison to handle different types
    //               );
    //               if (selectedMerchant) {
    //                 this.terminalForm
    //                   .get('merchantId')
    //                   .setValue(selectedMerchant.id);
    //               }
    //             }
    //           }
    //         });
    //       }
    //     },
    //   });

    this.service
      .GetAllErrandChannels()
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.errandChannelsList = resp.data;
          }
        },
      });

    this.service
      .GetAllPOSTypes()
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.posList = resp.data;
          }
        },
      });

    this.service
      .GetAllZones(0)
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.zonesList = resp.data;
            this.orignalZones = resp.data;
          }
        },
      });
  }

  getItemDetails() {
    this.service
      .GetDetails(this.id)
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.details = resp.data;
            if (this.details) {
              // setTimeout(() => {
              //   this.regionChanged(resp.data?.regionId);
              //   this.cityChanged(resp.data?.cityId);
              // }, 1000);

              this.terminalForm.patchValue(this.details);
              this.coordinates.lng = parseFloat(this.details.longitude);
              this.coordinates.lat = parseFloat(this.details.latitude);
              this.coordinates = { ...this.coordinates };
              this.terminalForm.updateValueAndValidity();
            }
          }
        },
      });
  }

  onSubmit() {}
  get f() {
    return this.terminalForm.controls;
  }
  submit() {
    let obj = this.terminalForm.value;
    if (!this.id) {
      delete obj.id;
    }
    if (this.merchantId) {
      obj.merchantId = this.merchantId;
    }
    this.service
      .Add(this.terminalForm.value)
      .pipe(takeWhile(() => this.alive))
      .subscribe((resp) => {
        if (resp.success) {
          this.backToList();
        }
      });
  }
  backToList() {
    this.route.queryParams.subscribe((params) => {
      if (params.hasOwnProperty('merchantId')) {
        const merchantId = params['merchantId'];
        this.router.navigate([`main/merchant/details/${merchantId}`]);
      } else {
        this.router.navigate(['main/terminal/list']);
      }
    });
  }

  print() {}

  regionChanged(event) {
    this.terminalForm.controls.cityId.setValue(null);
    this.terminalForm.controls.zoneId.setValue(null);
    this.citiesList = this.orignalCities;
    if (event) {
      this.citiesList = this.citiesList.filter(
        (x) => x.parentId == event.value
      );
    }
  }

  cityChanged(event) {
    this.terminalForm.controls.zoneId.setValue(null);
    this.zonesList = this.orignalZones;
    if (event) {
      this.zonesList = this.zonesList.filter((x) => x.parentId == event.value);
    }
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  pinLocation() {
    let lng = this.terminalForm?.get('longitudeInput').value;
    let lat = this.terminalForm?.get('latitudeInput').value;

    this.terminalForm?.get('latitude').setValue(lat);
    this.terminalForm?.get('longitude').setValue(lng);

    this.coordinates = {
      lat: lat,
      lng: lng,
    };
  }
}
