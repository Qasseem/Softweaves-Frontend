import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShipmentsService } from '../../services/shipments.service';
import { take } from 'rxjs';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { ExportExcelService } from 'src/app/modules/shared/Services/export-excel.service';

@Component({
  selector: 'app-shipment-details',
  templateUrl: './shipment-details.component.html',
  styleUrls: ['./shipment-details.component.css'],
})
export class ShipmentDetailsComponent implements OnInit {
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
      field: 'familyName',
      header: 'Inventory Family',
      width: '200px',
    },
    {
      field: 'categoryName',
      header: 'Category',
      width: '200px',
    },
    {
      field: 'modelTypeName',
      header: 'Device/Item',
      width: '200px',
    },
    {
      field: 'quantity',
      header: 'QTY',
      width: '200px',
    },
  ];
  constructor(
    private service: ShipmentsService,
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
        { type: '', label: 'Supplier', value: this.details?.supplier },
        { type: '', label: 'Shipment ID', value: this.details?.shipmentId },
        { type: '', label: 'Shipment Date', value: this.details?.shipmentDate },
        { type: 'date', label: 'Created At', value: this.details?.createDate },
        { type: '', label: 'Warehouse', value: this.details?.warehouseName },
      ],
    ];
  }
  prepareCardsData() {
    this.cards.push({
      title: 'Created By',
      name: this.details?.creator,
      phone: this.details?.creatorPhone,
    });
  }
  backToList() {
    this.router.navigate(['main/inventory/shipments/list']);
  }

  export() {
    this.exportExcelService.exportAsExcelFile(
      this.details?.shipmentDetails,
      'Units'
    );
  }
}
