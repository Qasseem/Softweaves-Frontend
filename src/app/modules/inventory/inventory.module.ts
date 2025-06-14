import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { InventoryRoutingModule } from './inventory-routing-module';
import { SharedModule } from '../shared/shared.module';
import { DevicesListComponent } from './pages/devices-list/devices-list.component';
import { DevicesFormComponent } from './pages/devices-form/devices-form.component';
import { ItemsWithoutSerialFormComponent } from './pages/items-without-serial-form/items-without-serial-form.component';
import { ItemsWithoutSerialListComponent } from './pages/items-without-serial-list/items-without-serial-list.component';
import { SimcardsFormComponent } from './pages/simcards-form/simcards-form.component';
import { SimcardsListComponent } from './pages/simcards-list/simcards-list.component';
import { TransferCustodyFormComponent } from './pages/transfer-custody-form/transfer-custody-form.component';
import { TransferCustodyListComponent } from './pages/transfer-custody-list/transfer-custody-list.component';
import { ModelTypesFormComponent } from './pages/model-types-form/model-types-form.component';
import { ModelTypesListComponent } from './pages/model-types-list/model-types-list.component';
import { WarehousesFormComponent } from './pages/warehouses-form/warehouses-form.component';
import { WarehousesListComponent } from './pages/warehouses-list/warehouses-list.component';
import { DevicesDetailsComponent } from './pages/devices-details/devices-details.component';
import { ItemsWithoutSerialWarehouseComponent } from './pages/items-without-serial-warehouse/items-without-serial-warehouse.component';
import { SimcardsDetailsComponent } from './pages/simcards-details/simcards-details.component';
import { ShipmentDetailsComponent } from './pages/shipment-details/shipment-details.component';
import { ShipmentFormComponent } from './pages/shipment-form/shipment-form.component';
import { ShipmentListComponent } from './pages/shipment-list/shipment-list.component';
import { TransferCustodyDetailsComponent } from './pages/transfer-custody-details/transfer-custody-details.component';
import { TransferCustodySerialsComponent } from './pages/transfer-custody-serials/transfer-custody-serials.component';
import { FileUploadModule } from 'src/app/core/shared/core/modules/table/components/file-upload/file-upload.module';
import { ItemsWithoutSerialEmployeeComponent } from './pages/items-without-serial-employee/items-without-serial-employee.component';
import { DeviceHistoryComponent } from './pages/device-history/device-history.component';
import { ItemsWithoutSerialEmployeeHistoryComponent } from './pages/items-without-serial-employee-history/items-without-serial-employee-history.component';
import { ItemsWithoutSerialWarehouseHistoryComponent } from './pages/items-without-serial-warehouse-history/items-without-serial-warehouse-history.component';

@NgModule({
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule,
    FileUploadModule,
  ],
  declarations: [
    InventoryComponent,
    DevicesListComponent,
    DevicesFormComponent,
    ItemsWithoutSerialFormComponent,
    ItemsWithoutSerialListComponent,
    SimcardsFormComponent,
    SimcardsListComponent,
    TransferCustodyFormComponent,
    TransferCustodyListComponent,
    ModelTypesFormComponent,
    ModelTypesListComponent,
    WarehousesFormComponent,
    WarehousesListComponent,
    DevicesDetailsComponent,
    ItemsWithoutSerialWarehouseComponent,
    ItemsWithoutSerialEmployeeComponent,
    SimcardsDetailsComponent,
    ShipmentDetailsComponent,
    ShipmentFormComponent,
    ShipmentListComponent,
    TransferCustodyDetailsComponent,
    TransferCustodySerialsComponent,
    DeviceHistoryComponent,
    ItemsWithoutSerialEmployeeHistoryComponent,
    ItemsWithoutSerialWarehouseHistoryComponent,
  ],
})
export class InventoryModule {}
