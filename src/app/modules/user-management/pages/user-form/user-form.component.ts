import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { TerminalService } from 'src/app/modules/terminal/services/terminal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith, takeWhile } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TicketService } from 'src/app/modules/ticket/services/ticket.service';
import { ToastService } from 'src/app/core/services/toaster.service';
import { UserTypeEnum } from 'src/app/core/shared/core/modules/table/models/enums';

@Component({
  selector: 'oc-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
  alive: boolean = true;
  form: FormGroup;
  formType = 'add';
  id;
  rolesIdsLists = [];
  managerIdsLists = [];
  regionsIdsLists = [];
  orignalCities = [];
  orignalZones = [];
  citiesLists = [];
  imageFieldName: string;
  zonesLists = [];
  details: any;
  selectedImages: any = {};
  previewImage: string;
  userTypes = [];
  profileImage: string | ArrayBuffer | null = null;
  fileName: string | null = null;
  categories = [];
  errandTypes = [];
  serviceTypeData = [];
  hideLocationAndServiceTypeAction: boolean;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private terminalService: TerminalService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private service: TicketService,
    public toaster: ToastService
  ) {
    this.formType = this.route.snapshot.data.type;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,4}$/i;
    const phoneNumberValidation = /^01\d{9}$/;
    const namePattern =
      /^[A-Za-z0-9!@#\$%\^\&*\)\(+=._-]+[A-Za-z0-9!@#\$%\^\&*\)\(+=._-]*[A-Za-z0-9!@#\$%\^\&*\)\(+=._-]+$/;

    this.form = this.fb.group(
      {
        imageBase64String: [null],
        firstName: ['', [Validators.required, Validators.pattern(namePattern)]],
        lastName: ['', [Validators.required, Validators.pattern(namePattern)]],
        userName: [
          '',
          [
            Validators.required,
            Validators.pattern(emailPattern),
            Validators.maxLength(50),
          ],
        ],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(phoneNumberValidation)],
        ],
        nationalId: [''],
        nationalIdBase64String: [null],
        userType: [null, Validators.required],
        managerId: [null],
        rolesIds: [[], Validators.required],
        userId: [null],
        isManager: [false],
        regionId: [null, Validators.required],
        cityId: [null, Validators.required],
        zoneId: [null, Validators.required],
        agentErrandTypes: this.fb.array([]),
        // password: [
        //   '',
        //   [
        //     Validators.required,
        //     Validators.minLength(8),
        //     Validators.pattern(RegexPatterns.password),
        //   ],
        // ],
        // confirmPassword: [
        //   '',
        //   [
        //     Validators.required,
        //     Validators.minLength(8),
        //     Validators.pattern(RegexPatterns.password),
        //   ],
        // ],
      }
      // { validators: PasswordMatchValidator('password', 'confirmPassword') }
    );
  }
  onFileSelectedNationalId(event: any) {
    const file = event.target.files[0];
    if (file && file.type.match('image.*')) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({
          nationalIdBase64String: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        // this.profileImage = result;
        this.form.get('imageBase64String').patchValue(result);
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit() {
    this.getAllCategories();
    this.getAllErrandTypes();
    this.GetUsersDropdownValues();
    if (this.formType == 'edit') {
      this.id = this.route.snapshot.params.id || null;
      if (this.id) {
        this.getItemDetails();
      }
    }

    this.form
      .get('userType')
      .valueChanges.pipe(startWith(null))
      .subscribe({
        next: (val) => {
          if (val == 2) {
            this.form.get('zoneId').clearValidators();
            this.form.get('zoneId').updateValueAndValidity();
          } else {
            this.form.get('zoneId').addValidators([Validators.required]);
            this.form.get('zoneId').updateValueAndValidity();
          }
        },
      });
  }
  GetUsersDropdownValues() {
    this.userService
      ?.getAllRolesDropdown()
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.rolesIdsLists = resp.data;
          }
        },
      });

    this.userService
      ?.getAllManagersDropdown()
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.managerIdsLists = resp.data;
          }
        },
      });

    this.userService
      ?.getAllUsersTypeDropDown()
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.userTypes = resp.data.map((x) => {
              x.inputId = x.nameEn;
              return x;
            });
          }
        },
      });
    const regionControl = this.form.get('regionId');
    this.terminalService
      .GetAllRegions()
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.regionsIdsLists = resp.data;
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
                  this.citiesLists = resp.data;
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
            .subscribe({
              next: (resp) => {
                if (resp.success) {
                  this.zonesLists = resp.data;
                  this.orignalZones = resp.data;
                  // this.form.get('zoneId').setValue(resp.data[0].id);
                }
              },
            });
        }
      },
    });
  }

  regionChanged(event) {
    this.form.controls.cityId.setValue(null);
    this.citiesLists = this.orignalCities;
    if (event) {
      this.citiesLists = this.citiesLists.filter(
        (x) => x.parentId == event.value
      );
    }
  }

  cityChanged(event) {
    this.form.controls.zoneId.setValue(null);
    this.zonesLists = this.orignalZones;
    if (event) {
      this.zonesLists = this.zonesLists.filter(
        (x) => x.parentId == event.value
      );
    }
  }
  downloadImage(url, filename) {
    if (url.includes('missing')) return;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        link.href = objectUrl;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: (error) => {
        // console.error('Download failed', error);
      },
    });
  }

  getItemDetails() {
    this.userService
      .GetDetails(this.id)
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.details = resp.data;
            if (this.details) {
              this.prepareagentErrandTypesForm();
              this.form.patchValue(this.details);
              this.form.get('userId').patchValue(this.details.userId);
              if (resp.data.rolesIds) {
                this.form.get('rolesIds').setValue(resp.data.rolesIds);
              }
              // this.profileImage = resp.data.imageUrl;
              this.form.get('imageBase64String').patchValue(resp.data.imageUrl);
              this.fileName = 'National ID File';
              this.form
                .get('nationalIdBase64String')
                .patchValue(resp.data.nationalIdUrl);
            }
          }
        },
      });
  }

  get f() {
    return this.form.controls;
  }
  submit() {
    if (this.formType == 'add') {
      this.userService
        .Save(this.form.value)
        .pipe(takeWhile(() => this.alive))
        .subscribe({
          next: (resp) => {
            if (resp.success) {
              this.backToList();
            }
          },
        });
    } else {
      this.userService
        .UpdateUser(this.form.value)
        .pipe(takeWhile(() => this.alive))
        .subscribe({
          next: (resp) => {
            if (resp.success) {
              this.backToList();
            }
          },
        });
    }
  }

  refactorObjectBeforeSubmit(object) {
    if (object) {
      if (object.regionId) {
        delete object.regionId;
      }
      if (object.cityId) {
        delete object.cityId;
      }
    }
    return object;
  }

  backToList() {
    this.router.navigate(['main/user-management/user/list']);
  }

  ngOnDestroy() {
    this.alive = false;
  }

  addErrandType() {
    let index = (this.form.get('agentErrandTypes') as FormArray).length;
    let ifIndexExists = this.serviceTypeData.find((x) => x.index == index);
    if (ifIndexExists) {
      this.serviceTypeData = this.serviceTypeData.filter(
        (x) => x.index != index
      );
    }
    let item = {
      index: index,
      data: this.errandTypes,
    };
    this.serviceTypeData.push(item);

    const group = this.fb.group({
      categoryId: this.fb.control(null, Validators.required),
      errandTypes: this.fb.control([], [Validators.required]),
    });
    (this.form.get('agentErrandTypes') as FormArray).push(group);
  }

  getAllCategories() {
    this.service.getTicketCategory().subscribe({
      next: (res) => {
        res.data.map((item) => {
          item.inputId = `category-${item.nameEn}`;
        });
        this.categories = res.data;
      },
    });
    // thi
  }
  CategoryChanged(event, index) {
    let formArray = this.form.get('agentErrandTypes') as FormArray;

    let selectedCategories = this.form.value.agentErrandTypes.map(
      (item) => item.categoryId
    ) as [];

    if (new Set(selectedCategories).size !== selectedCategories.length) {
      this.toaster.showError('Please select unique categories');
      formArray['controls'][index]['controls']['categoryId'].setValue(null);
    }

    formArray['controls'][index]['controls']['errandTypes'].setValue(null);
    const categoryData = this.serviceTypeData.find((x) => x.index === index);
    categoryData.data = this.errandTypes.filter(
      (x) => x.categoryId === event.value
    );
  }

  errandTypeChange(event, i) {}
  getAllErrandTypes() {
    this.service.GetErrandTypeDropDown().subscribe({
      next: (res) => {
        this.errandTypes = res.data;
        if (!this.id) {
          this.addErrandType();
        }
      },
    });
  }

  getFillteredErrandTypes(i) {
    if (i > -1) {
      return this.serviceTypeData.find((x) => x.index == i)?.data;
    }
  }
  removeErrandType(index) {
    (this.form.get('agentErrandTypes') as FormArray).removeAt(index);
    this.serviceTypeData = this.serviceTypeData.filter((x) => x.index != index);
    for (let i = 0; i < this.serviceTypeData.length; i++) {
      this.serviceTypeData[i].index = i;
    }
  }

  prepareagentErrandTypesForm() {
    if (this.details.agentErrandTypes) {
      this.details.agentErrandTypes.map((item) => {
        this.addErrandType();
        this.serviceTypeData[this.serviceTypeData.length - 1].data =
          this.errandTypes.filter((x) => x.categoryId === item.categoryId);
      });
    }
  }

  userTypeChanged(event) {
    if (event?.value == UserTypeEnum.SysytemUser) {
      this.hideLocationAndServiceTypeAction = true;
      this.form.get('cityId').clearValidators();
      this.form.get('cityId').updateValueAndValidity();
      this.form.get('zoneId').clearValidators();
      this.form.get('zoneId').updateValueAndValidity();
      this.form.get('regionId').clearValidators();
      this.form.get('regionId').updateValueAndValidity();
      this.clearagentErrandTypesItems();
    } else {
      this.hideLocationAndServiceTypeAction = false;
      this.form.controls.cityId.setValidators([Validators.required]);
      this.form.controls.zoneId.setValidators([Validators.required]);
      this.form.controls.regionId.setValidators([Validators.required]);
      let items = this.form.get('agentErrandTypes') as FormArray;
      if (!items.length) {
        this.addErrandType();
      }
    }
    this.form.updateValueAndValidity();
  }

  clearagentErrandTypesItems() {
    let items = this.form.get('agentErrandTypes') as FormArray;
    items.clear();
  }
}
