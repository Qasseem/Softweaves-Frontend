import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { ExportExcelService } from 'src/app/modules/shared/Services/export-excel.service';
import { TransferCustodyService } from '../../services/transfer-custody.service';
@Component({
  selector: 'app-transfer-custody-details',
  templateUrl: './transfer-custody-details.component.html',
  styleUrls: ['./transfer-custody-details.component.css'],
})
export class TransferCustodyDetailsComponent implements OnInit {
  id;
  details;
  cards = [];
  detailsSections: { type: string; label: string; value: any }[][];

  public columns: ColumnsInterface[] = [
    {
      field: 'id',
      header: 'NO.',
      width: '50px',
    },

    {
      field: 'modelFamily',
      header: 'Inventory Family',
      width: '200px',
    },
    {
      field: 'modelCategory',
      header: 'Category',
      width: '200px',
    },
    {
      field: 'modelType',
      header: 'Device/Item',
      width: '200px',
    },
    {
      field: 'quantity',
      header: 'QTY',
      width: '200px',
    },
  ];

  public serialColumns: ColumnsInterface[] = [
    {
      field: 'id',
      header: 'NO.',
      width: '50px',
    },

    {
      field: 'modelFamily',
      header: 'Inventory Family',
      width: '200px',
    },
    {
      field: 'modelCategory',
      header: 'Category',
      width: '200px',
    },
    {
      field: 'modelType',
      header: 'Device/Item',
      width: '200px',
    },
    {
      field: 'serialNumber',
      header: 'Serial Number',
      width: '200px',
    },
    {
      field: 'imei',
      header: 'IMEI',
      width: '200px',
    },
  ];

  constructor(
    private service: TransferCustodyService,
    private route: ActivatedRoute,
    private router: Router,
    private exportExcelService: ExportExcelService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id || null;
    if (this.id) {
      this.getItemDetails();
    }
  }
  getItemDetails() {
    this.service
      .getDetailsById(this.id)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.details = resp.data;
          this.prepareCardsData();
          this.prepareFiledsData();
        }
      });
  }
  prepareFiledsData() {
    this.detailsSections = [
      [
        { type: '', label: 'Reference', value: this.details?.id },
        {
          type: '',
          label: 'From',
          value: this.details?.from ? this.details?.from : 'Custody',
        },
        { type: '', label: 'To', value: this.details?.to },
        { type: '', label: 'Status', value: this.details?.status },
        { type: 'date', label: 'Created At', value: this.details?.createDate },
      ],
      [
        { type: '', label: 'Country', value: this.details?.country },
        { type: '', label: 'Region', value: this.details?.region },
        { type: '', label: 'City', value: this.details?.city },
      ],
      [
        { type: '', label: 'User Type', value: this.details?.userType },
        { type: '', label: 'Team', value: this.details?.team },
      ],
    ];
  }
  prepareCardsData() {
    this.cards.push({
      title: 'Created By',
      name: this.details?.createdBy,
      phone: this.details?.creatorPhone,
    });
  }
  backToList() {
    this.router.navigate(['main/inventory/transfercustody/list']);
  }

  export() {
    let obj = this.details.details.map((item) => {
      return {
        ID: item.id,
        Family: item.modelFamily,
        Category: item.modelCategory,
        Modeltype: item.modelType,
        Quantity: item.quantity,
      };
    });
    this.exportExcelService.exportAsExcelFile(obj, 'Models');
  }

  exportSerials() {
    let obj = this.details.items.map((item) => {
      return {
        ID: item.id,
        Family: item.modelFamily,
        Category: item.modelCategory,
        Modeltype: item.modelType,
        serialNumber: item.serialNumber,
        IMEI: item.imei,
      };
    });
    this.exportExcelService.exportAsExcelFile(obj, 'Serilas');
  }
  downloadFile(url: string): void {
    window.open(url, '_blank');
  }
}
