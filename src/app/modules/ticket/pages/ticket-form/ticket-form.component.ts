import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TerminalService } from 'src/app/modules/terminal/services/terminal.service';
import { TicketService } from '../../services/ticket.service';
import { combineLatest, take, takeWhile } from 'rxjs';
import { UserService } from 'src/app/modules/user-management/services/user.service';
import { ToastService } from 'src/app/core/services/toaster.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ServiceCategoryEnum } from 'src/app/core/shared/core/modules/table/models/enums';

@Component({
  selector: 'oc-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss'],
})
export class TicketFormComponent implements OnInit {
  alive = true;
  ticketForm: FormGroup;
  formType = 'add';
  categories = [];
  errandTypes = [];
  merchants = [];
  terminals = [];
  assignees = [];
  errandChannels = [];
  posTypes = [];
  regions = [];
  cities = [];
  orignalCities = [];
  zones = [];
  orignalZones = [];
  details;
  coordinates = { lat: null, lng: null };
  base64Strings: string[] = [];
  id;
  errandTypeModel = {
    errandTypeId: null,
    quantity: null,
  };
  viewModel;
  terminalId: any;
  terminalData: any;
  constructor(
    private fb: FormBuilder,
    private service: TicketService,
    private terminalService: TerminalService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastService,
    private authSerivce: AuthService
  ) {
    this.formType = this.route.snapshot.data.type;
    this.id = this.route.snapshot.params.id;
  }
  getTerminalDetails() {
    if (this.terminalId) {
      this.terminalService
        .GetDetails(this.terminalId)
        .pipe(take(1))
        .subscribe((resp) => {
          if (resp.success) {
            this.terminalData = resp.data;
            this.fillFormWithTerminalDetails();
          }
        });
    }
  }
  fillFormWithTerminalDetails() {
    if (this.terminalData) {
      this.ticketForm.controls.categoryId.setValue(ServiceCategoryEnum.Visit); //For visit
      this.ticketForm.controls.terminalId.setValue(this.terminalData.id);
      this.ticketForm.controls.merchantId.setValue(
        this.terminalData.merchantId
      );
      this.ticketForm.controls.terminalId.disable();
      this.ticketForm.controls.merchantId.disable();
      this.ticketForm.updateValueAndValidity();
    }
  }

  ngOnInit() {
    this.buildForm();
    this.getLookups();
    this.merchantValueChange();
    this.categoryValueChange();
    this.terminalValueChange();
    this.GetTicketLocationDropdownValues();
    this.zoneValueChange();
    this.latLngValueChange();
    if (this.id) {
      this.getTicket(this.id);
      if (this.authSerivce.hasPermission('tickets-all-tickets-editassignee')) {
        this.ticketForm.get('assigneeId').enable();
        this.ticketForm.get('assigneeId').updateValueAndValidity();
      } else {
        this.ticketForm.get('assigneeId').disable();
        this.ticketForm.get('assigneeId').updateValueAndValidity();
      }
    }

    this.terminalId = this.route.snapshot.params.terminalId;
    this.getTerminalDetails();
  }
  getTicket(id) {
    this.service.getById(id).subscribe({
      next: (res) => {
        this.viewModel = res.data;
        this.patchForm(res.data);
      },
    });
  }
  patchForm(data) {
    if (data.errandType.length) {
      data.errandType.forEach((x) => {
        this.addErrandType(x);
      });
    }
    if (data.attachments.length) {
      data.attachments.forEach((base64String) => {
        (this.ticketForm.get('attachmentsBase64') as FormArray).push(
          this.fb.control(base64String.attachmentUrl)
        );
      });
    }
    this.ticketForm.patchValue(data);
    if (this.formType == 'edit') {
      this.ticketForm.get('categoryId').disable();
      this.ticketForm.get('categoryId').updateValueAndValidity();
    }
  }

  latLngValueChange() {
    combineLatest([
      this.ticketForm.get('latitude').valueChanges,
      this.ticketForm.get('longitude').valueChanges,
    ]).subscribe({
      next: ([lat, lng]) => {
        // if (lat && lng) this.handleAddress({ latitude: lat, longitude: lng });
      },
    });
  }
  zoneValueChange() {
    let errandTypeIds = [];
    let errandChannel = this.ticketForm.get('errandTypes').value;

    if (errandChannel) {
      errandTypeIds = errandChannel.map((x) => x.errandTypeId);
    }
    let categoryId = this.ticketForm.get('categoryId').value;
    let zoneId = this.ticketForm.get('zoneId').value;
    if (categoryId && zoneId && errandTypeIds.length) {
      this.service
        .getZoneAgents({
          zoneId,
          categoryId,
          errandTypeIds: errandTypeIds,
        })
        .subscribe({
          next: (res) => {
            if (res.data?.length > 0) {
              this.assignees = res.data;

              if (this.formType == 'add') {
                this.ticketForm
                  .get('assigneeId')
                  .patchValue(
                    this.assignees.find((x) => x.isSelected == true).id
                  );
                this.ticketForm.get('assigneeId').disable();
                this.ticketForm.get('assigneeId').updateValueAndValidity();
              }
            }

            // }
          },
        });
    }
  }
  handleAddress(resp: any) {
    this.coordinates = {
      lat: resp.latitude,
      lng: resp.longitude,
    };
    this.terminalService
      .GetAddressFromLatLng(resp.latitude, resp.longitude)
      .subscribe((resp: any) => {
        // if (this.formType == 'add')
        // this.ticketForm.get('address').patchValue(resp?.address.LongLabel);
      });
  }
  terminalValueChange() {
    this.ticketForm.get('terminalId').valueChanges.subscribe({
      next: (terminalId) => {
        if (terminalId) {
          this.service.getTerminalDetails(terminalId).subscribe({
            next: (res) => {
              this.details = res.data;
              if (this.ticketForm.get('categoryId').value != '1') {
                this.ticketForm
                  .get('longitude')
                  .patchValue(this.details.longitude);
                this.ticketForm
                  .get('latitude')
                  .patchValue(this.details.latitude);
                this.ticketForm
                  .get('regionId')
                  .patchValue(this.details.regionId);
                this.ticketForm.get('cityId').patchValue(this.details.cityId);
                this.ticketForm.get('zoneId').patchValue(this.details.zoneId);
                this.coordinates = {
                  lat: this.ticketForm.get('longitude').value,
                  lng: this.ticketForm.get('latitude').value,
                };
                this.coordinates = { ...this.coordinates };
                this.ticketForm.get('address').patchValue(this.details.address);
                this.ticketForm
                  .get('phoneNumber')
                  .patchValue(this.details.phoneNumber);
                this.ticketForm
                  .get('errandChannelId')
                  .patchValue(this.details.errandChannelId);
                this.ticketForm
                  .get('posTypeId')
                  .patchValue(this.details.posTypeId);
                this.handleAddress(this.details);
                this.zoneValueChange();
              }
            },
          });
        }
      },
    });
  }

  merchantValueChange() {
    this.ticketForm.get('merchantId').valueChanges.subscribe({
      next: (merchantId) => {
        if (merchantId) {
          this.terminalService
            .GetAllTerminalsByMerchantId(merchantId)
            .subscribe({
              next: (res) => {
                this.terminals = res.data;
              },
            });
        }
      },
    });
  }

  errandTypeChange(event, index) {
    const requireQuantity = this.errandTypes.find(
      (x) => x.id == event.value
    ).requireQuantity;
    if (requireQuantity) {
      (this.ticketForm.get('errandTypes') as FormArray).controls[index]
        .get('quantity')
        .enable();
      (this.ticketForm.get('errandTypes') as FormArray).controls[index]
        .get('quantity')
        .addValidators([Validators.required]);
      (this.ticketForm.get('errandTypes') as FormArray).controls[index]
        .get('quantity')
        .updateValueAndValidity();
    } else {
      (this.ticketForm.get('errandTypes') as FormArray).controls[index]
        .get('quantity')
        .disable();
      (this.ticketForm.get('errandTypes') as FormArray).controls[index]
        .get('quantity')
        .clearValidators();
      (this.ticketForm.get('errandTypes') as FormArray).controls[index]
        .get('quantity')
        .updateValueAndValidity();
    }

    this.zoneValueChange();

    // this.ticketForm.get('')
  }
  categoryValueChange() {
    this.ticketForm.get('categoryId').valueChanges.subscribe({
      next: (categoryId) => {
        if (categoryId) {
          this.service.getCategoryErrandTypes(categoryId).subscribe({
            next: (res) => {
              this.errandTypes = res.data;
            },
          });
          if (this.formType == 'add') {
            (this.ticketForm.get('errandTypes') as FormArray).clear();
            this.addErrandType({ errandTypeId: null, quantity: null });
          }
          if (categoryId == '1') {
            this.ticketForm.get('terminalId').clearValidators();
            this.ticketForm.get('terminalId').disable();
            this.ticketForm.get('terminalId').updateValueAndValidity();
          } else {
            this.ticketForm
              .get('terminalId')
              .addValidators([Validators.required]);
            if (!this.terminalId) {
              this.ticketForm.get('terminalId').enable();
            }
            this.ticketForm.get('terminalId').updateValueAndValidity();
          }
        }
      },
    });
  }

  getLookups() {
    this.service.getTicketCategory().subscribe({
      next: (res) => {
        res.data.map((item) => {
          item.inputId = `category-${item.nameEn}`;
        });
        this.categories = res.data;
        //check if comes from Terminal view to remove development category
        if (this.terminalId) {
          this.categories = this.categories.filter(
            (x) => x?.id != ServiceCategoryEnum.Deployment
          );
        }
      },
    });
    // this.terminalService.GetAllMerchantDropDown().subscribe({
    //   next: (res) => {
    //     res.data.forEach((item) => {
    //       item.searchKey =
    //         (item?.id ?? '') +
    //         (item.nameEn ?? '') +
    //         (item?.nameAr ?? '') +
    //         (item?.merchantId ?? '');
    //     });

    //     this.merchants = res.data;
    //   },
    // });
    this.terminalService.GetAllErrandChannels().subscribe({
      next: (res) => {
        this.errandChannels = res.data;
      },
    });
    this.terminalService.GetAllPOSTypes().subscribe({
      next: (res) => {
        this.posTypes = res.data;
      },
    });
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.assignees = res.data;
      },
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const files = event.target.files;
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          (this.ticketForm.get('attachmentsBase64') as FormArray).push(
            this.fb.control(e.target.result)
          );
        };
        reader.readAsDataURL(file);
      });
    }
  }

  buildForm() {
    this.ticketForm = this.fb.group({
      categoryId: ['', Validators.required],
      merchantId: [null, Validators.required],
      terminalId: [null, Validators.required],
      assigneeId: [{ value: null, disabled: true }, Validators.required],
      notes: [null],
      zoneId: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      posTypeId: [null, Validators.required],
      errandChannelId: [null, Validators.required],
      regionId: [null, Validators.required],
      cityId: [null, Validators.required],
      latitude: [null],
      longitude: [null],
      latitudeInput: [null],
      longitudeInput: [null],
      address: [null, Validators.required],
      landMark: [null],
      attachmentsBase64: this.fb.array([]),
      errandTypes: this.fb.array([], Validators.required),
      id: [null],
    });

    if (this.formType == 'add')
      this.addErrandType({ errandTypeId: null, quantity: null });
  }
  addErrandType(data) {
    const group = this.fb.group({
      errandTypeId: this.fb.control(data.errandTypeId, Validators.required),
      quantity: this.fb.control(data.quantity, [
        Validators.required,
        Validators.min(1),
        Validators.max(10000),
      ]),
    });
    (this.ticketForm.get('errandTypes') as FormArray).push(group);
  }
  removeErrandType(index) {
    (this.ticketForm.get('errandTypes') as FormArray).removeAt(index);
    this.zoneValueChange();
  }
  cityChanged(event) {
    this.ticketForm.controls.zoneId.setValue(null);
    this.zones = this.orignalZones;
    if (event) {
      this.zones = this.zones.filter((x) => x.parentId == event.value);
    }
  }

  regionChanged(event) {
    this.ticketForm.controls.cityId.setValue(null);
    this.ticketForm.controls.zoneId.setValue(null);
    this.cities = this.orignalCities;
    if (event) {
      this.cities = this.cities.filter((x) => x.parentId == event.value);
    }
  }
  GetTicketLocationDropdownValues() {
    const regionControl = this.ticketForm.get('regionId');

    this.terminalService
      .GetAllRegions()
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.regions = resp.data;
          }
        },
      });
    const cityControl = this.ticketForm.get('cityId');
    regionControl.valueChanges.subscribe({
      next: (regionId) => {
        if (regionId) {
          this.terminalService
            .GetAllCities(regionId)
            .pipe(takeWhile(() => this.alive))
            .subscribe({
              next: (resp) => {
                if (resp.success) {
                  this.cities = resp.data;
                  this.orignalCities = resp.data;
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
                this.zones = resp.data;
                this.orignalZones = resp.data;
              }
            });
        }
      },
    });
  }
  formatLngLat(string) {
    return string !== null ? parseInt(string).toFixed(6).toString() : '-';
  }

  submit() {
    const formValue = structuredClone(this.ticketForm.getRawValue());
    delete formValue.regionId;
    delete formValue.cityId;
    if (this.formType == 'add' || this.formType == 'clone') {
      delete formValue.id;
    }
    if (this.ticketForm.valid) {
      this.service.Save(formValue).subscribe({
        next: (res) => {
          if (res.success) {
            let message = '';
            if (this.formType == 'add') {
              message = 'Ticket Added Successfully';
            } else if (this.formType == 'edit') {
              message = 'Ticket Updated Successfully';
            } else {
              message = 'Ticket Cloned Successfully';
            }
            this.toaster.showSuccess(message);
            this.backToList();
          }
        },
      });
    } else {
      this.ticketForm.errors;
      this.ticketForm.markAllAsTouched();
    }
  }

  backToList() {
    this.router.navigate(['main/ticket/list']);
  }
  removeImage(index) {
    (this.ticketForm.get('attachmentsBase64') as FormArray).removeAt(index);
  }

  pinLocation() {
    let lng = this.ticketForm?.get('longitudeInput').value;
    let lat = this.ticketForm?.get('latitudeInput').value;

    this.ticketForm?.get('latitude').setValue(lat);
    this.ticketForm?.get('longitude').setValue(lng);

    this.coordinates = {
      lat: lat,
      lng: lng,
    };
  }
  get f() {
    return this.ticketForm.controls;
  }
}
