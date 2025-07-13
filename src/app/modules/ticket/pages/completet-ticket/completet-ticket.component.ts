import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { TerminalService } from 'src/app/modules/terminal/services/terminal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take, pipe } from 'rxjs';
import { ToastService } from 'src/app/core/services/toaster.service';
import { TicketCategoryEnum } from 'src/app/core/shared/core/modules/table/models/enums';
import { HttpService } from 'src/app/core/http/http.service';

@Component({
  selector: 'app-completet-ticket',
  templateUrl: './completet-ticket.component.html',
  styleUrls: ['./completet-ticket.component.scss'],
})
export class CompletetTicketComponent implements OnInit {
  id;
  form: FormGroup;
  form2: FormGroup;
  data: any;
  showReplacmentModal = false;
  visible = false;
  options: any;
  simCardProviders = [];
  statusOptions: any[] = [
    { name: 'Succeeded', key: 1 },
    { name: 'Failed', key: 2 },
  ];
  details: any;
  fileName: any;
  files = [];
  oldFiles = [];
  images = [];
  oldImages = [];
  failReasons = [];
  ticketCategory: TicketCategoryEnum;
  TicketCategoryEnum = TicketCategoryEnum;
  selectedItem: any;
  isAllTasksStatusesDone: any;
  showChart: boolean;
  showSimcardProviderInput: boolean = false;
  showDeliveredQtyInput: boolean = false;
  countryId: any;
  paperRollModelTypes = [];
  cableModelTypes = [];
  deployRecipts = [];
  cancellationRecipts = [];
  constructor(
    private fb: FormBuilder,
    private service: TicketService,
    private terminalService: TerminalService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastService,
    private httpService: HttpService
  ) {
    this.id = this.route.snapshot.params.id || null;
    this.getTicketDetails(this.id);
    this.buildForm();
    this.buildReplacmentForm();
    this.getFailedReasons();
    this.countryId = httpService.country;
    this.getSimcardProviders();
  }
  getSimcardProviders() {
    this.service
      .getSIMCardProviders(this.countryId)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.simCardProviders = resp.data;
        }
      });
  }
  getFailedReasons() {
    this.service.getFailReasons().subscribe((res) => {
      if (res.success) {
        this.failReasons = res.data;
      }
    });
  }
  getTicketDetails(id: any) {
    if (id) {
      this.showChart = false;
      this.service.getDeploymentStatus(id).subscribe((res) => {
        if (res.success) {
          this.details = res.data;
          this.checkForNotCompleteTasks();
          this.setChartData();
          this.setTaskType();
          this.ticketCategory = this.details.categoryId;
          this.buildFormValidators();
        }
      });
    }
  }
  private buildFormValidators(): void {
    switch (this.ticketCategory) {
      case TicketCategoryEnum.Deployment:
        this.setValidatorsForDeployment();
        break;
      case TicketCategoryEnum.Cancellation:
        this.setValidatorsForCancellation();
        break;
      case TicketCategoryEnum.Replacement:
        this.setValidatorsForReplacement();
        break;
      default:
        throw new Error(`Unsupported ticket category: ${this.ticketCategory}`);
    }
  }

  private setValidatorsForDeployment(): void {
    // this.form.get('receiptModelTypeId')?.setValidators([Validators.required]);
    // this.form.get('cableModelTypeId')?.setValidators([Validators.required]);
    // this.form.get('paperRollModelTypeId')?.setValidators([Validators.required]);
  }

  private setValidatorsForCancellation(): void {
    // this.form.get('receiptModelTypeId')?.setValidators([Validators.required]);
  }

  private setValidatorsForReplacement(): void {
    // this.form.get('receiptModelTypeId')?.setValidators([Validators.required]);
  }
  setTaskType() {
    if (
      this.details?.categoryId == TicketCategoryEnum.Deployment ||
      this.details?.categoryId == TicketCategoryEnum.Replacement
    ) {
      this.showSimcardProviderInput = true;
      // this.form.controls.simCardModelTypeId.setValidators([
      //   Validators.required,
      // ]);
    }
    if (
      this.details?.categoryId == TicketCategoryEnum.Visit ||
      this.details?.categoryId == TicketCategoryEnum.AfterSales
    ) {
      this.showDeliveredQtyInput = true;
      this.form.controls.deliveredQuantity.setValidators([Validators.required]);

      this.form.controls.deliveredQuantity.pristine;
    }

    this.form.updateValueAndValidity();
  }

  ngOnInit() {
    this.GetCancellationReceiptModelTypes();
    this.GetDeployReceiptModelTypes();
    this.GetCableModelTypes();
    this.GetPaperRollModelTypes();
  }
  buildForm() {
    this.form = this.fb.group({
      ticketId: ['', Validators.required],
      statusId: [1, Validators.required],
      errandTypeId: [null, Validators.required],
      failReasonId: [null, Validators.required],
      terminalId: [null, Validators.required],
      posSerial: [null, Validators.required],
      imei: [null, Validators.required],
      simSerial: [null, Validators.required],
      notes: [null, Validators.required],
      images: [[], Validators.required],
      files: [[], Validators.required],
      id: [null],
      deliveredQuantity: [null, []],
      simCardModelTypeId: [null, []],
      selectedTaskId: [null],

      cableModelTypeId: [null],
      receiptModelTypeId: [null],
      paperRollModelTypeId: [null],
    });
  }

  buildReplacmentForm() {
    this.form2 = this.fb.group({
      oldTerminalId: [null, Validators.required],
      oldPosSerial: [null, Validators.required],
      oldIMEI: [null, Validators.required],
      oldSIMSerial: [null, Validators.required],
      oldImages: [[], Validators.required],
      oldFiles: [[], Validators.required],
      oldReceiptModelTypeId: [null],
      statusId: [1, Validators.required],
    });
  }

  GetCancellationReceiptModelTypes() {
    this.service
      .GetCancellationReceiptModelTypes()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.cancellationRecipts = resp.data;
        }
      });
  }

  GetDeployReceiptModelTypes() {
    this.service
      .GetDeployReceiptModelTypes()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.deployRecipts = resp.data;
        }
      });
  }

  GetCableModelTypes() {
    this.service
      .GetCableModelTypes()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.cableModelTypes = resp.data;
        }
      });
  }

  GetPaperRollModelTypes() {
    this.service
      .GetPaperRollModelTypes()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.paperRollModelTypes = resp.data;
        }
      });
  }
  backToList() {
    this.router.navigate(['main/ticket/list']);
  }
  compeletTask() {
    const formStatusId = this.form.controls.statusId.value;

    let obj = this.form.value;
    obj = { ...obj, ...this.form2.value };

    obj.files = this.files.map((x) => x.data);
    obj.images = this.images.map((x) => x.data);

    obj.oldFiles = this.oldFiles.map((x) => x.data);
    obj.oldImages = this.oldImages.map((x) => x.data);

    obj.ticketId = +this.id;
    obj.errandTypeId = this.selectedItem.errandTypeId;
    if (obj?.failReasonId && formStatusId == 2) {
      obj.statusId = formStatusId;
    }
    this.service
      .CompleteTicket(obj)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.getTicketDetails(this.id);
          this.visible = false;
          this.showDeliveredQtyInput = false;
          this.showSimcardProviderInput = false;

          this.cleanFilesArrayAndResetFrom();
        }
      });
  }
  cleanFilesArrayAndResetFrom() {
    this.form.reset();
    this.form.controls.statusId.setValue(1);
    this.form2.reset();
    this.form2.controls.statusId.setValue(1);
    this.files = [];
    this.images = [];
    this.oldFiles = [];
    this.oldImages = [];
  }
  setChartData() {
    var data = [
      this.details?.pending,
      this.details?.success,
      this.details?.failed,
    ];
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      datasets: [
        {
          data: [...data],
          backgroundColor: ['#E3E7EE', 'green', 'red'],
          hoverBackgroundColor: ['#E3E7EE', 'green', 'red'],
        },
      ],
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };

    this.showChart = true;
  }

  statusChange(event) {
    if (this.ticketCategory == TicketCategoryEnum.Replacement) {
      this.replacementPopupstatusChange(event);
    }
  }
  get f() {
    return this.form.controls;
  }

  get f2() {
    return this.form2.controls;
  }
  next() {
    this.showReplacmentModal = false;
    this.visible = true;
  }
  onFileSelectedNationalId(event: any, isFromReplacment = false) {
    const file = event.target.files[0];
    if (file && file.type.match('image.*')) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        let file = {
          name: this.fileName,
          data: reader.result,
        };
        isFromReplacment ? this.oldFiles.push(file) : this.files.push(file);
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelected(event, isFromReplacment = false) {
    const file = event.target.files[0];
    if (file && file.type.match('image.*')) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        let file = {
          name: this.fileName,
          data: reader.result,
        };
        isFromReplacment ? this.oldImages.push(file) : this.images.push(file);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(item) {
    this.images.splice(this.images.indexOf(item), 1);
  }

  removeFromOldImages(item) {
    this.oldImages.splice(this.oldImages.indexOf(item), 1);
  }
  deleteFile(file) {
    this.files.splice(this.files.indexOf(file), 1);
  }

  deleteFromOldFiles(file) {
    this.oldFiles.splice(this.files.indexOf(file), 1);
  }
  openCompleteTaskPopup(item) {
    this.selectedItem = item;
    this.form.reset();
    this.form.controls.statusId.setValue(1);

    if (this.ticketCategory == TicketCategoryEnum.Replacement) {
      this.showReplacmentModal = true;
    } else this.visible = true;
  }
  checkForNotCompleteTasks() {
    this.isAllTasksStatusesDone = this.details.tasks.every(
      (x) => x.statusId != 3
    );
  }
  submit() {
    if (!this.isAllTasksStatusesDone) {
      this.toaster.showError('Please complete all tasks first');
      return;
    }
    this.service.forceComplete({ ticketId: this.id }).subscribe((res) => {
      if (res.success) {
        this.backToList();
      }
    });
  }

  replacementPopupstatusChange(event) {
    if (event.value == 1) {
      this.showReplacmentModal = true;
      this.visible = false;
      this.form.controls.statusId.setValue(1);
      this.form2.controls.statusId.setValue(1);
    } else if (event.value == 2) {
      this.showReplacmentModal = false;
      this.visible = true;
      this.form.controls.statusId.setValue(2);
      this.form2.controls.statusId.setValue(2);
    }
  }
}
