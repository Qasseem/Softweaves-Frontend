import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../services/devices.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-device-actions-details',
  templateUrl: './device-actions-details.component.html',
  styleUrls: ['./device-actions-details.component.css'],
})
export class DeviceActionsDetailsComponent implements OnInit {
  id;
  details;
  cards = [];
  detailsSections: {
    type: string;
    label: string;
    value: any;
    showField: boolean;
  }[][];

  oldDeviceSections: {
    type: string;
    label: string;
    value: any;
    showField: boolean;
  }[][];
  newDeviceSections: {
    type: string;
    label: string;
    value: any;
    showField: boolean;
  }[][];
  replacementSections: {
    type: string;
    label: string;
    value: any;
    showField: boolean;
  }[][];
  isDeployment = false;
  isCancellation = false;
  isReplacement = false;
  actionFrom: any;

  constructor(
    private service: DevicesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id || null;
    this.actionFrom = this.route.snapshot.params.actionId || null;

    if (this.id) {
      this.getItemDetails();
    }
  }
  getItemDetails() {
    if (!this.actionFrom) {
      this.getBasicDetails();
    } else {
      let api =
        this.actionFrom.toLowerCase() == 'deploy'
          ? this.service.GetDeploymentHistoryLogDetails(this.id)
          : this.actionFrom.toLowerCase() == 'cancel'
          ? this.service.GetCancellationHistoryLogDetails(this.id)
          : this.service.GetReplacementHistoryLogDetails(this.id);
      this.getReportDetails(api);
    }
  }
  getReportDetails(api: Observable<any>) {
    api.pipe(take(1)).subscribe((resp) => {
      if (resp.success) {
        this.details = resp.data;
        this.setActionTypeProp();
        this.prepareCardsData();
      }
    });
  }

  getBasicDetails() {
    this.service
      .GetHistoryLogDetails(this.id)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.details = resp.data;
          this.setActionTypeProp();
          this.prepareCardsData();
        }
      });
  }
  setActionTypeProp() {
    this.isDeployment = this.details.transactionType === ActionType.Deployment;
    this.isCancellation =
      this.details.transactionType === ActionType.Cancellation;
    this.isReplacement =
      this.details.transactionType === ActionType.Replacement;
    this.isReplacement
      ? this.prepareFiledsDataForReplacement()
      : this.prepareFiledsDataForDeploymentOrCancellation();
  }
  prepareFiledsDataForDeploymentOrCancellation() {
    this.detailsSections = [
      [
        {
          showField: true,
          type: '',
          label: 'Device ID',
          value: this.details?.deviceId,
        },
        {
          showField: true,
          type: '',
          label: 'Model Type',
          value: this.details?.modeltypeName,
        },
        {
          showField: true,
          type: '',
          label: 'Action Type',
          value: this.details?.transactionType,
        },
        {
          showField: true,
          type: 'date',
          label: this.isCancellation
            ? 'Cancel Date'
            : this.isDeployment
            ? 'Deployment Date'
            : ' Replacement Date',
          value: this.details?.actionDate,
        },
        { showField: true, type: '', label: 'MID', value: this.details?.mid },
        { showField: true, type: '', label: 'TID', value: this.details?.tid },
        {
          showField: this.isDeployment,
          type: '',
          label: 'Setup Amount',
          value: this.details?.setupAmount,
        },
        {
          showField: this.isDeployment,
          type: '',
          label: 'Subscription Amount',
          value: this.details?.subscriptionAmount,
        },
        {
          showField: this.isCancellation,
          type: '',
          label: 'Cancellation Fee',
          value: this.details?.fee,
        },
        {
          showField: this.isCancellation,
          type: '',
          label: 'Warehouse',
          value: this.details?.warehouseName,
        },
      ],
      [
        {
          showField: this.isDeployment,
          type: '',
          label: 'Warehouse',
          value: this.details?.warehouseName,
        },
        {
          showField: true,
          type: '',
          label: 'Merchant Name',
          value: this.details?.merchantName,
        },
        {
          showField: this.isDeployment,
          type: '',
          label: 'Subscribtion Type',
          value: this.details?.subscriptionTypeName,
        },
        {
          showField: true,
          type: '',
          label: 'Currency',
          value: this.details?.currencyName,
        },
        {
          showField: true,
          type: '',
          label: 'Payment Method',
          value: this.details?.paymentMethodName,
        },
        {
          showField: true,
          type: '',
          label: 'Payment Status',
          value: this.details?.paymentStatusName,
        },
        {
          showField: true,
          type: '',
          label: 'Serial Number',
          value: this.details?.serialNumber,
        },
        {
          showField: true,
          type: '',
          label: 'IMEI',
          value: this.details?.imei,
        },
        {
          showField: this.isCancellation,
          type: '',
          label: 'Trx_ID',
          value: this.details?.trx_ID,
        },
        {
          showField: this.isCancellation,
          type: '',
          label: 'GTG, Good To Go',
          value: this.details?.gtg ? 'Yes' : 'No',
        },
      ],
      [
        {
          showField: this.isDeployment,
          type: '',
          label: 'Trx_ID',
          value: this.details?.trx_ID,
        },
        {
          showField: true,
          type: '',
          label: 'Deployment Recipt Signed?',
          value: this.details?.receiptSigned ? 'Yes' : 'No',
        },
        {
          showField: this.isCancellation,
          type: '',
          label: 'Need Recycling?',
          value: this.details?.needRecycling ? 'Yes' : 'No',
        },
        {
          showField: this.isCancellation,
          type: '',
          label: 'Need Repair?',
          value: this.details?.needRepair ? 'Yes' : 'No',
        },
        {
          showField: this.isCancellation,
          type: '',
          label: 'Need Branding?',
          value: this.details?.needBranding ? 'Yes' : 'No',
        },
        {
          showField: true,
          type: '',
          label: this.isDeployment ? 'Deployment Team' : 'Cancellation Team',
          value: this.details?.teamName,
        },
        {
          showField: true,
          type: '',
          label: 'Current Condition',
          value: this.details?.conditionName,
        },
        {
          showField: this.isDeployment,
          type: '',
          label: 'Address',
          value: this.details?.address,
        },
      ],
    ];
  }

  prepareFiledsDataForReplacement() {
    this.replacementSections = [
      [
        {
          showField: true,
          type: '',
          label: 'Device ID',
          value: this.details?.deviceId,
        },
        {
          showField: true,
          type: '',
          label: 'Model Type',
          value: this.details?.modeltypeName,
        },
        {
          showField: true,
          type: '',
          label: 'Action Type',
          value: this.details?.transactionType,
        },
        {
          showField: true,
          type: 'date',
          label: ' Replacement Date',
          value: this.details?.actionDate,
        },
      ],
    ];

    this.oldDeviceSections = [
      [
        {
          showField: true,
          type: '',
          label: 'Old Merchant Name',
          value: this.details?.oldMerchantName,
        },
        {
          showField: true,
          type: '',
          label: 'Old MID',
          value: this.details?.oldMID,
        },
      ],
      [
        {
          showField: true,
          type: '',
          label: 'Old Serial',
          value: this.details?.oldSerialNumber,
        },
        {
          showField: true,
          type: '',
          label: 'Old TID',
          value: this.details?.oldMID,
        },
      ],
      [
        {
          showField: true,
          type: '',
          label: 'Old IMEI',
          value: this.details?.oldIMEI,
        },
      ],
    ];

    this.newDeviceSections = [
      [
        {
          showField: true,
          type: '',
          label: 'New Merchant Name',
          value: this.details?.merchantName,
        },
        {
          showField: true,
          type: '',
          label: 'New MID',
          value: this.details?.mid,
        },
      ],
      [
        {
          showField: true,
          type: '',
          label: 'New Serial',
          value: this.details?.serialNumber,
        },
        {
          showField: true,
          type: '',
          label: 'New TID',
          value: this.details?.tid,
        },
      ],
      [
        {
          showField: true,
          type: '',
          label: 'New IMEI',
          value: this.details?.imei,
        },
      ],
    ];

    this.detailsSections = [
      [
        {
          showField: true,
          type: '',
          label: 'Cancellation Fee',
          value: this.details?.fee,
        },
        {
          showField: true,
          type: '',
          label: 'Trx_ID',
          value: this.details?.trx_ID,
        },
        {
          showField: true,
          type: '',
          label: 'Currency',
          value: this.details?.currencyName,
        },
        {
          showField: true,
          type: '',
          label: 'Payment Method',
          value: this.details?.paymentMethodName,
        },
      ],
      [
        {
          showField: true,
          type: '',
          label: 'GTG, Good To Go',
          value: this.details?.gtg ? 'Yes' : 'No',
        },
        {
          showField: true,
          type: '',
          label: 'Deployment Recipt Signed?',
          value: this.details?.receiptSigned ? 'Yes' : 'No',
        },
        {
          showField: true,
          type: '',
          label: 'Need Recycling?',
          value: this.details?.needRecycling ? 'Yes' : 'No',
        },
        {
          showField: true,
          type: '',
          label: 'Need Repair?',
          value: this.details?.needRepair ? 'Yes' : 'No',
        },
      ],
      [
        {
          showField: true,
          type: '',
          label: 'Need Branding?',
          value: this.details?.needBranding ? 'Yes' : 'No',
        },
        {
          showField: true,
          type: '',
          label: 'Deployment Team',
          value: this.details?.teamName,
        },
        {
          showField: true,
          type: '',
          label: 'Current Condition',
          value: this.details?.conditionName,
        },
      ],
    ];
  }
  prepareCardsData() {
    this.cards.push({
      title: 'Action By',
      name: this.details?.creator,
      phone: this.details?.creatorPhoneNumber,
      class: 'col-12',
    });
  }
  backToList() {
    this.router.navigate(['main/inventory/devices/list']);
  }

  downloadFile(url: string): void {
    window.open(url, '_blank');
  }
}

enum ActionType {
  Deployment = 'Deployment',
  Cancellation = 'Cancellation',
  Replacement = 'Replacement',
}
