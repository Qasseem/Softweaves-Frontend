import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { DevicesService } from '../../services/devices.service';
import { TableButtonsExistanceInterface } from 'src/app/core/shared/core/modules/table/models/table-url.interface';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { ActionsInterface } from 'src/app/core/shared/core/modules/table/models/actions.interface';

@Component({
  selector: 'app-device-actions-history',
  templateUrl: './device-actions-history.component.html',
  styleUrls: ['./device-actions-history.component.css'],
})
export class DeviceActionsHistoryComponent implements OnInit {
  id;
  quantity;
  shipmentId;
  showStockDialog = false;
  row: any;
  data = [];
  constructor(
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute,
    public service: DevicesService
  ) {
    this.id = this.route.snapshot.params.id || null;
  }

  ngOnInit() {
    this.getHistory();
  }
  getHistory() {
    if (this.id) {
      this.service.GetHistoryLog(this.id).subscribe((res) => {
        if (res.success) {
          this.data = res.data;
        }
      });
    }
  }

  navigateToAdd() {
    this.router.navigate(['main/inventory/warehouses/add']);
  }

  public tableBtns: TableButtonsExistanceInterface = {
    showAllButtons: true,
    showAdd: false,
    showExport: false,
    showFilter: false,
    showImport: false,
  };
  public columns: ColumnsInterface[] = [
    {
      field: 'deviceId',
      header: 'ID',
      width: '50px',
    },

    {
      field: 'transactionType',
      header: 'Action Type',
      width: '200px',
    },
    {
      field: [
        { label: 'creator', custom: 'normal' },
        { label: 'createDate', custom: 'defaultDate' },
      ],
      header: 'Created by',
      customCell: 'multiLabel',
      width: '100px',
    },
  ];

  public actions: ActionsInterface[] = [
    {
      name: 'History',
      icon: 'pi pi-history',
      call: (row: any) => this.gotoHistory(row),
      customPermission: (row: any) => true,
    },
  ];

  backToList() {
    this.router.navigate(['main/inventory/devices/list']);
  }
  adjustStock(row: any): any {
    this.row = row;
    this.quantity = +this.row.quantity;
    this.showStockDialog = true;
  }

  gotoHistory(row: any): any {
    const URL = `main/inventory/device//${row?.itemId}/${row?.warehouseId}`;
    this.router.navigate([URL]);
  }
}
