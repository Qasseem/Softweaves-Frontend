import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  ActionsInterface,
  ActionsTypeEnum,
} from 'src/app/core/shared/core/modules/table/models/actions.interface';
import {
  HTTPMethods,
  SearchInputTypes,
} from 'src/app/core/shared/core/modules/table/models/enums';
import { SearchInterface } from 'src/app/core/shared/core/modules/table/models/search-interface';
import { TableButtonsExistanceInterface } from 'src/app/core/shared/core/modules/table/models/table-url.interface';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { ItemsWithoutSerialService } from '../../services/items-without-serial.service';
import { WarehousesService } from '../../services/warehouses.service';

@Component({
  selector: 'app-items-without-serial-list',
  templateUrl: './items-without-serial-list.component.html',
  styleUrls: ['./items-without-serial-list.component.scss'],
})
export class ItemsWithoutSerialListComponent implements OnInit {
  row: any;
  bulkAdd(row: any): any {}
  showAdjustStock = true;
  showEmployeeStock = true;
  showWarehouseStock = true;
  showEdit = true;
  viewDetails = true;
  showStockDialog = false;
  quantity;
  warehouse;
  warehouses = [];
  shipmentId;
  blockItem(row: any): any {}
  constructor(
    private router: Router,
    public authService: AuthService,
    public service: ItemsWithoutSerialService,
    private warehouseService: WarehousesService
  ) {}

  ngOnInit(): void {
    this.viewDetails = this.authService.hasPermission(
      'inventory-items-without-serial-details'
    );
    this.tableBtns.showExport = this.authService.hasPermission(
      'inventory-items-without-serial-export'
    );
    this.showAdjustStock = this.authService.hasPermission(
      'inventory-items-without-serial-adjuststock'
    );
    this.showEdit = this.authService.hasPermission(
      'inventory-items-without-serial-edit'
    );

    this.showWarehouseStock = this.authService.hasPermission(
      'inventory-items-without-serial-warehousestock'
    );
    this.showEmployeeStock = this.authService.hasPermission(
      'inventory-items-without-serial-employeestock'
    );
  }

  navigateToAdd() {
    this.router.navigate(['main/inventory/itemswithoutserial/add']);
  }

  editItem(row: any): any {
    const URL = `main/inventory/itemswithoutserial/edit/${row?.id}`;
    this.router.navigate([URL]);
  }

  public tableBtns: TableButtonsExistanceInterface = {
    showAllButtons: true,
    showAdd: true,
    showExport: true,
    showFilter: true,
    showImport: false,
  };

  filters: SearchInterface[] = [
    {
      type: SearchInputTypes.text,
      field: 'itemId',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'itemName',
      isFixed: true,
    },

    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'itemTypeIds',
      isFixed: true,
      url: '/ItemWithoutSerial/GetCategoryDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
      params: 0,
    },
    // {
    //   isMultiple: true,
    //   type: SearchInputTypes.select,
    //   field: 'warehouse',
    //   isFixed: true,
    //   url: '/Warehouse/GetWarehouseDropDown',
    //   method: HTTPMethods.getReq,
    //   propValueName: 'id',
    // },
    // {
    //   isMultiple: true,
    //   type: SearchInputTypes.select,
    //   field: 'agent',
    //   isFixed: true,
    //   url: '/User/GetAllUsersDropDown',
    //   method: HTTPMethods.getReq,
    //   propValueName: 'id',
    // },
  ];

  public columns: ColumnsInterface[] = [
    {
      field: 'id',
      header: 'ID',
      width: '50px',
    },

    {
      field: 'categoryName',
      header: 'Item Category',
      width: '100px',
    },
    {
      field: 'modelTypeName',
      header: 'Item Name',
      width: '100px',
    },

    {
      field: 'warehouseQuantity',
      header: 'Warehouse QTY',
      width: '100px',
      customCell: 'navTo',
      action: (row) => this.adjustWarehouseStock(row),
    },
    {
      field: 'employeeQuantity',
      header: 'Employee QTY',
      width: '100px',
    },
  ];

  public actions: ActionsInterface[] = [
    {
      name: 'Edit',
      icon: 'pi pi-file-edit',
      call: (row: any) => this.editItem(row),
      customPermission: (row: any) => this.showEdit,
    },
    // {
    //   name: 'Adjust QTY',
    //   icon: 'pi pi-objects-column',
    //   call: (row: any) => this.adjustStock(row),
    //   customPermission: (row: any) => this.showAdjustStock,
    // },
    // {
    //   name: 'Warehouse QTY',
    //   icon: 'pi pi-warehouse',
    //   call: (row: any) => this.adjustWarehouseStock(row),
    //   customPermission: (row: any) => this.showWarehouseStock,
    // },
    // {
    //   name: 'Employee QTY',
    //   icon: 'pi pi-users',
    //   call: (row: any) => this.adjustEmployeeStock(row),
    //   customPermission: (row: any) => this.showEmployeeStock,
    // },
  ];
  public gridActionsList: ActionsInterface[] = [
    {
      name: 'Bulk Add',
      icon: 'pi pi-file-plus',
      permission: 'inventory-items-without-serial-add',
      call: (row: any) => this.bulkAdd(row),
      type: ActionsTypeEnum.File,
      uploadFileData: {
        url: '/ItemWithoutSerial/import',
        header: 'Upload Bulk Items Without Serial',
        templateName: 'Import Item Without Serial Template.xlsx',
      },
    },
  ];

  getAllWarehouses() {
    if (this.warehouses.length == 0) {
      this.warehouseService.getAgentWarehouseDropDown().subscribe((res) => {
        if (res.success) {
          this.warehouses = res.data;
        }
      });
    }
  }

  adjustStock(row: any): any {
    this.getAllWarehouses();
    this.row = row;
    this.quantity = +this.row.warehouseQuantity + +this.row.employeeQuantity;
    this.showStockDialog = true;
  }

  adjustQty() {
    this.service;
  }

  adjustEmployeeStock(row: any): any {}
  adjustWarehouseStock(row: any) {
    this.router.navigate([
      `main/inventory/itemswithoutserial/warehouse/${row?.id}`,
    ]);
  }
}
