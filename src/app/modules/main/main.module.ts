import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

@NgModule({
  imports: [CommonModule, MainRoutingModule, SharedModule],
  declarations: [MainComponent],
})
export class MainModule {}
