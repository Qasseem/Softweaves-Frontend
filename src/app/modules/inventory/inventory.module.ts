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

@NgModule({
  imports: [CommonModule, InventoryRoutingModule, SharedModule],
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
    SimcardsDetailsComponent,
    ShipmentDetailsComponent,
    ShipmentFormComponent,
    ShipmentListComponent,
    TransferCustodyDetailsComponent,
    TransferCustodySerialsComponent,
  ],
})
export class InventoryModule {}
