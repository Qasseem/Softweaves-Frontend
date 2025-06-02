import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ItemsWithoutSerialService } from '../../services/items-without-serial.service';
import { TableButtonsExistanceInterface } from 'src/app/core/shared/core/modules/table/models/table-url.interface';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { ActionsInterface } from 'src/app/core/shared/core/modules/table/models/actions.interface';

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
  constructor(
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute,
    public service: ItemsWithoutSerialService
  ) {
    this.id = this.route.snapshot.params.id || null;
  }

  ngOnInit() {
    this.showEdit = this.authService.hasPermission(
      'inventory-items-without-serial-edit'
    );
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
      header: 'Waehouse Name',
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
    const URL = `main/inventory/itemswithoutserial/employeehistory/${row?.itemId}/${row?.employeeId}`;
    this.router.navigate([URL]);
  }
}
