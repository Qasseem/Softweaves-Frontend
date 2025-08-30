import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DevicesService } from '../../services/devices.service';
import { take } from 'rxjs';
import { ModeltypesService } from '../../services/modeltypes.service';
import { WarehousesService } from '../../services/warehouses.service';
import { ErrandChannelService } from 'src/app/modules/admin-activities/services/errand-channel.service';
import { TerminalService } from 'src/app/modules/terminal/services/terminal.service';
import { ToastService } from 'src/app/core/services/toaster.service';

@Component({
  selector: 'app-devices-form',
  templateUrl: './devices-form.component.html',
  styleUrls: ['./devices-form.component.scss'],
})
export class DevicesFormComponent implements OnInit {
  form: FormGroup;
  details: any;
  id;
  formType = 'add';
  modelCategories = [];
  modelTypes = [];
  errandChanelsList = [];
  warehousesList = [];
  deviceConditionList = [];
  fileName: any;
  files = [];
  banksList = [];
  countriesList = [];
  locationsList = [];
  constructor(
    private fb: FormBuilder,
    private service: DevicesService,
    private router: Router,
    private route: ActivatedRoute,
    private modeltypesService: ModeltypesService,
    private warehousesService: WarehousesService,
    private terminalService: TerminalService,
    private toaster: ToastService
  ) {
    this.formType = this.route.snapshot.data.type;
  }

  ngOnInit() {
    if (this.formType == 'edit') {
      this.id = this.route.snapshot.params.id || null;
      if (this.id) {
        this.getItemDetails();
      }
    }
    this.form = this.fb.group({
      modelCategoryId: ['', [Validators.required]],
      modelTypeId: [null, [Validators.required]],
      conditionId: [null, [Validators.required]],
      errandChannelId: [null],
      shipmentId: [null],
      warehouseId: [null, [Validators.required]],
      serialNumber: [null, [Validators.required]],
      imei: [null, [Validators.required]],
      bankId: [null, [Validators.required]],
      countryId: [null, [Validators.required]],
      locationId: [null, [Validators.required]],
      notes: [null, [Validators.maxLength(500)]],
      simSerial: [null, []],
      attachmentsBase64: [[]],
      id: [null],
    });
    this.getLookupsDropdowns();
  }
  getLookupsDropdowns() {
    this.getmodelCategories();
    this.getWarehouseDropDown();
    this.getAllErrandChannels();
    this.getDeviceConditionDropDown();
    this.getDeviceConditionDropDown();
    this.getBanksList();
    this.getCountriesList();
    this.getLoactionsList();
  }

  onChangeModelCategory(event) {
    this.form.controls.modelTypeId.setValue(null);
    if (event) {
      this.getModelTypeDropDown(event);
    }
  }

  getmodelCategories() {
    this.modeltypesService
      .getCategoryDropDown()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.modelCategories = resp.data;
        }
      });
  }
  getModelTypeDropDown(id: number) {
    this.modeltypesService
      .getModelTypeDropDown(id)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.modelTypes = resp.data;
          if (this.formType == 'edit') {
            this.form.get('modelTypeId').setValue(this.details.modelTypeId);
          }
        }
      });
  }

  getWarehouseDropDown() {
    this.warehousesService
      .getWarehouseDropDown()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.warehousesList = resp.data;
        }
      });
  }

  getAllErrandChannels() {
    this.terminalService
      .GetAllErrandChannels()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.errandChanelsList = resp.data;
        }
      });
  }

  getDeviceConditionDropDown() {
    this.service
      .getConditionDropDown()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.deviceConditionList = resp.data;
        }
      });
  }

  getBanksList() {
    this.service
      .getBanksList()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.banksList = resp.data;
        }
      });
  }

  getCountriesList() {
    this.service
      .getCountriesList()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.countriesList = resp.data;
        }
      });
  }

  getLoactionsList() {
    this.service
      .getLoactionsList()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.locationsList = resp.data;
        }
      });
  }

  getItemDetails() {
    this.service
      .getDetailsById(this.id)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.details = resp.data;
          if (this.details) {
            this.form.patchValue(this.details);
            this.form.get('modelCategoryId').setValue(this.details.categoryId);
            this.form.updateValueAndValidity();
            this.getModelTypeDropDown(this.form.get('modelCategoryId').value);
            this.prepareFiles(resp.data);
          }
        }
      });
  }
  prepareFiles(data: any) {
    if (data.attachments.length > 0) {
      this.files = data.attachments.map((file, index) => {
        return {
          name: 'File ' + (index + 1),
          data: null,
          type: null,
          url: file.attachmentUrl,
          base64: null,
          isImage: this.checkIfFileIsImage(file.attachmentUrl),
        };
      });
    }
  }
  checkIfFileIsImage(attachmentUrl: any) {
    //Checks if the file is an image based on its URL extension
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    return imageExtensions.some((ext) =>
      attachmentUrl.toLowerCase().endsWith(ext)
    );
  }
  get f() {
    return this.form.controls;
  }
  submit() {
    let obj = this.form.value;
    if (!this.id) {
      obj.id = 0;
    }
    this.addAttachmentsToFormAsBase64(obj);
    if (this.formType == 'add') {
      this.service
        .add(this.form.value)
        .pipe(take(1))
        .subscribe({
          next: (resp) => {
            if (resp.success) {
              this.backToList();
            }
          },
        });
    } else {
      this.service
        .update(this.form.value)
        .pipe(take(1))
        .subscribe({
          next: (resp) => {
            if (resp.success) {
              this.backToList();
            }
          },
        });
    }
  }
  addAttachmentsToFormAsBase64(obj: any) {
    if (this.files.length > 0) {
      obj.attachmentsBase64 = this.files.map((file) => {
        return file.base64 || file.url;
      });
    } else {
      obj.attachmentsBase64 = [];
    }
    this.form.patchValue({
      attachmentsBase64: obj.attachmentsBase64,
    });
    this.form.updateValueAndValidity();
  }

  onFileSelected(event) {
    if (this.files.length >= 5) {
      this.toaster.showError('max 5 files allowed');
    }
    const file = event.target.files[0];
    let base64String = '';
    if (file) {
      this.convertFileToBase64(file).then((base64: string) => {
        base64String = base64;
      });
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        let toSaveFile = {
          name: this.fileName,
          data: reader.result,
          type: file.type,
          base64: base64String,
          isImage: file.type.match('image.*'),
          url: null,
        };
        this.files.push(toSaveFile);
      };
      reader.readAsDataURL(file);
    }
  }

  // onFileSelected(event: any) {
  //   if (event.target.files.length > 0) {
  //     const files = event.target.files;
  //     Array.from(files).forEach((file: File) => {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         (this.form.get('attachmentsBase64') as FormArray).push(
  //           this.fb.control(e.target.result)
  //         );
  //       };
  //       reader.readAsDataURL(file);
  //     });
  //   }
  // }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  removeImage(item) {
    this.files.splice(this.files.indexOf(item), 1);
  }

  backToList() {
    this.router.navigate(['main/inventory/devices/list']);
  }
}
