import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgPanelModule } from 'src/app/core/shared/primeng/primeng-panel-module';
import { TranslateModule } from '@ngx-translate/core';
import { ListComponent } from './components/list/list.component';
import { PrimeNgInputsModule } from '../../../primeng/primeng-input-module';
import { PrimeNgButtonsModule } from '../../../primeng/primeng-button-module';
import { TableComponent } from './table.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FormModule } from 'src/app/core/shared/form/form-module';
import { FileUploadModule } from './components/file-upload/file-upload.module';
import { IconModule } from 'src/app/modules/shared/inline-svg-icon/icon.module';
import { OcDdlComponent } from '../../../components/oc-ddl/oc-ddl.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  imports: [
    CommonModule,
    PrimeNgPanelModule,
    TranslateModule,
    PrimeNgInputsModule,
    FormModule,
    PrimeNgButtonsModule,
    FileUploadModule,
    OcDdlComponent,
    ConfirmDialogModule,
    IconModule,
  ],
  declarations: [ListComponent, TableComponent, SearchBarComponent],
  exports: [ListComponent, TableComponent, SearchBarComponent, OcDdlComponent],
})
export class PrimeTableModule {}
