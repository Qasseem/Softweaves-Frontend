import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InventoryComponent } from './inventory.component';
import { DevicesListComponent } from './pages/devices-list/devices-list.component';
import { DevicesFormComponent } from './pages/devices-form/devices-form.component';
import { ItemsWithoutSerialFormComponent } from './pages/items-without-serial-form/items-without-serial-form.component';
import { ItemsWithoutSerialListComponent } from './pages/items-without-serial-list/items-without-serial-list.component';
import { SimcardsListComponent } from './pages/simcards-list/simcards-list.component';
import { SimcardsFormComponent } from './pages/simcards-form/simcards-form.component';
import { WarehousesListComponent } from './pages/warehouses-list/warehouses-list.component';
import { WarehousesFormComponent } from './pages/warehouses-form/warehouses-form.component';
import { ModelTypesListComponent } from './pages/model-types-list/model-types-list.component';
import { ModelTypesFormComponent } from './pages/model-types-form/model-types-form.component';
import { TransferCustodyListComponent } from './pages/transfer-custody-list/transfer-custody-list.component';
import { TransferCustodyFormComponent } from './pages/transfer-custody-form/transfer-custody-form.component';
import { DevicesDetailsComponent } from './pages/devices-details/devices-details.component';
import { ItemsWithoutSerialWarehouseComponent } from './pages/items-without-serial-warehouse/items-without-serial-warehouse.component';
import { SimcardsDetailsComponent } from './pages/simcards-details/simcards-details.component';
import { ShipmentListComponent } from './pages/shipment-list/shipment-list.component';
import { ShipmentFormComponent } from './pages/shipment-form/shipment-form.component';
import { ShipmentDetailsComponent } from './pages/shipment-details/shipment-details.component';
import { TransferCustodyDetailsComponent } from './pages/transfer-custody-details/transfer-custody-details.component';
import { TransferCustodySerialsComponent } from './pages/transfer-custody-serials/transfer-custody-serials.component';
import { ItemsWithoutSerialEmployeeComponent } from './pages/items-without-serial-employee/items-without-serial-employee.component';
import { DeviceHistoryComponent } from './pages/device-history/device-history.component';
import { ItemsWithoutSerialEmployeeHistoryComponent } from './pages/items-without-serial-employee-history/items-without-serial-employee-history.component';
import { ItemsWithoutSerialWarehouseHistoryComponent } from './pages/items-without-serial-warehouse-history/items-without-serial-warehouse-history.component';
import { DeviceDeploymentComponent } from './pages/device-deployment/device-deployment.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    children: [
      {
        path: '',
        component: DevicesListComponent,
      },
      //Devices--------------------------------
      {
        path: 'devices/list',
        component: DevicesListComponent,
      },
      {
        path: 'devices/add',
        component: DevicesFormComponent,
        data: {
          type: 'add',
        },
      },
      {
        path: 'devices/edit/:id',
        component: DevicesFormComponent,
        data: {
          type: 'edit',
        },
      },
      {
        path: 'devices/details/:id',
        component: DevicesDetailsComponent,
      },
      {
        path: 'devices/history/:id/:serial',
        component: DeviceHistoryComponent,
      },
      {
        path: 'devices/deploy/:id',
        component: DeviceDeploymentComponent,
      },
      //Items Without Serial--------------------------------
      {
        path: 'itemswithoutserial/list',
        component: ItemsWithoutSerialListComponent,
      },
      {
        path: 'itemswithoutserial/add',
        component: ItemsWithoutSerialFormComponent,
        data: {
          type: 'add',
        },
      },
      {
        path: 'itemswithoutserial/edit/:id',
        component: ItemsWithoutSerialFormComponent,
        data: {
          type: 'edit',
        },
      },
      {
        path: 'itemswithoutserial/warehouse/:id',
        component: ItemsWithoutSerialWarehouseComponent,
        data: {
          type: 'edit',
        },
      },
      {
        path: 'itemswithoutserial/employee/:id',
        component: ItemsWithoutSerialEmployeeComponent,
        data: {
          type: 'edit',
        },
      },
      {
        path: 'itemswithoutserial/employeehistory/:id/:ownerId',
        component: ItemsWithoutSerialEmployeeHistoryComponent,
      },
      {
        path: 'itemswithoutserial/warehousehistory/:id/:ownerId',
        component: ItemsWithoutSerialWarehouseHistoryComponent,
      },
      //Sim Card--------------------------------
      {
        path: 'simcards/list',
        component: SimcardsListComponent,
      },
      {
        path: 'simcards/add',
        component: SimcardsFormComponent,
        data: {
          type: 'add',
        },
      },
      {
        path: 'simcards/edit/:id',
        component: SimcardsFormComponent,
        data: {
          type: 'edit',
        },
      },
      {
        path: 'simcards/details/:id',
        component: SimcardsDetailsComponent,
      },
      //WareHouse--------------------------------
      {
        path: 'warehouses/list',
        component: WarehousesListComponent,
      },
      {
        path: 'warehouses/add',
        component: WarehousesFormComponent,
        data: {
          type: 'add',
        },
      },
      {
        path: 'warehouses/edit/:id',
        component: WarehousesFormComponent,
        data: {
          type: 'edit',
        },
      },
      //Modeltype--------------------------------
      {
        path: 'modeltypes/list',
        component: ModelTypesListComponent,
      },
      {
        path: 'modeltypes/add',
        component: ModelTypesFormComponent,
        data: {
          type: 'add',
        },
      },
      {
        path: 'modeltypes/edit/:id',
        component: ModelTypesFormComponent,
        data: {
          type: 'edit',
        },
      },

      //Shipment--------------------------------
      {
        path: 'shipments/list',
        component: ShipmentListComponent,
      },
      {
        path: 'shipments/add',
        component: ShipmentFormComponent,
        data: {
          type: 'add',
        },
      },
      {
        path: 'shipments/edit/:id',
        component: ShipmentFormComponent,
        data: {
          type: 'edit',
        },
      },
      {
        path: 'shipments/details/:id',
        component: ShipmentDetailsComponent,
        data: {
          type: 'edit',
        },
      },
      //TransferCustody--------------------------------
      {
        path: 'transfercustody/list',
        component: TransferCustodyListComponent,
      },
      {
        path: 'transfercustody/add',
        component: TransferCustodyFormComponent,
        data: {
          type: 'add',
        },
      },
      {
        path: 'transfercustody/edit/:id',
        component: TransferCustodyFormComponent,
        data: {
          type: 'edit',
        },
      },
      {
        path: 'transfercustody/details/:id',
        component: TransferCustodyDetailsComponent,
        data: {
          type: 'edit',
        },
      },
      {
        path: 'transfercustody/serials/:id',
        component: TransferCustodySerialsComponent,
        data: {
          type: 'serials',
        },
      },
      { path: '', redirectTo: 'devices/list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
