import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ItemsWithoutSerialService } from '../../services/items-without-serial.service';
import { TableButtonsExistanceInterface } from 'src/app/core/shared/core/modules/table/models/table-url.interface';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { ActionsInterface } from 'src/app/core/shared/core/modules/table/models/actions.interface';
import { take } from 'rxjs';
import { DeviceStatusEnum } from 'src/app/core/shared/core/modules/table/models/enums';
import { WarehousesService } from '../../services/warehouses.service';

@Component({
  selector: 'app-items-without-serial-employee',
  templateUrl: './items-without-serial-employee.component.html',
  styleUrls: ['./items-without-serial-employee.component.css'],
})
export class ItemsWithoutSerialEmployeeComponent implements OnInit {
  id;
  quantity;
  shipmentId;
  showStockDialog = false;
  row: any;
  rowData: any;
  showreturnToWarehouseDialog: boolean;
  warehouseId: any;
  conditionId: any;
  canReturn: boolean = true;
  warehousesList: any[] = [];
  constructor(
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute,
    public service: ItemsWithoutSerialService,
    private warehousesService: WarehousesService
  ) {
    this.id = this.route.snapshot.params.id || null;
  }

  ngOnInit() {
    this.getWarehouseDropDown();
    this.showEdit = this.authService.hasPermission(
      'inventory-items-without-serial-edit'
    );

    if (
      !this.authService.hasPermission(
        'inventory-items-without-serial-returntowarehouse'
      )
    ) {
      this.canReturn = false;
    }
  }

  getWarehouseDropDown() {
    this.warehousesService
      .getAgentWarehouseDropDown()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.warehousesList = resp.data;
        }
      });
  }

  navigateToAdd() {
    this.router.navigate(['main/inventory/warehouses/add']);
  }

  public tableBtns: TableButtonsExistanceInterface = {
    showAllButtons: true,
    showAdd: false,
    showExport: true,
    showFilter: false,
    showImport: false,
  };
  public columns: ColumnsInterface[] = [
    {
      field: 'itemId',
      header: 'ID',
      width: '50px',
    },

    {
      field: 'itemName',
      header: 'Item Name',
      width: '200px',
    },
    {
      field: 'itemType',
      header: 'Item Type',
      width: '200px',
    },
    {
      field: 'warehouse',
      header: 'Employee',
      width: '200px',
    },
    {
      field: 'quantity',
      header: 'QTY',
      width: '200px',
    },
  ];

  public actions: ActionsInterface[] = [
    // {
    //   name: 'Edit',
    //   icon: 'pi pi-file-edit',
    //   call: (row: any) => this.adjustStock(row),
    //   customPermission: (row: any) => this.showEdit,
    // },
    {
      name: 'History',
      icon: 'pi pi-history',
      call: (row: any) => this.gotoHistory(row),
      customPermission: (row: any) => true,
    },
    {
      name: 'Return to Warehouse',
      icon: 'pi pi-undo',
      call: (row: any) => this.returnToWarehouseDialoge(row),
      customPermission: (row: any) => this.canReturn,
    },
  ];
  backToList() {
    this.router.navigate(['main/inventory/itemswithoutserial/list']);
  }
  adjustStock(row: any): any {
    this.row = row;
    this.quantity = +this.row.quantity;
    this.showStockDialog = true;
  }

  adjustQty() {
    this.service
      .adjustWarehouseStock({
        itemId: +this.id,
        quantity: +this.quantity,
        warehouseId: +this.row.warehouseId,
      })
      .subscribe((res) => {
        if (res.success) {
          this.row.quantity = +this.quantity;
          this.showStockDialog = false;
        }
      });
  }
  showEdit = true;
  gotoHistory(row: any): any {
    const URL = `main/inventory/itemswithoutserial/employeehistory/${row?.itemId}/${row?.warehouseId}`;
    this.router.navigate([URL]);
  }

  returnToWarehouseDialoge(row: any): any {
    if (row) {
      this.rowData = row;
      this.showreturnToWarehouseDialog = true;
    }
  }
  returnToWarehouse() {
    let data = {
      agentId: this.rowData.warehouseId,
      warehouseId: this.warehouseId,
      itemId: this.rowData.itemId,
      quantity: this.quantity,
    };
    this.service
      .returnToWarehouse(data)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.rowData.quantity = this.rowData.quantity - this.quantity;
          this.showreturnToWarehouseDialog = false;
          this.warehouseId = null;
          this.quantity = null;
        }
      });
  }
}
