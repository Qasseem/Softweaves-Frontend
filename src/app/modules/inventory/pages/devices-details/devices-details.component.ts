import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../services/devices.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-devices-details',
  templateUrl: './devices-details.component.html',
  styleUrls: ['./devices-details.component.css'],
})
export class DevicesDetailsComponent implements OnInit {
  id;
  details;
  cards = [];
  detailsSections: { type: string; label: string; value: any }[][];

  constructor(
    private service: DevicesService,
    private route: ActivatedRoute,
    private router: Router
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
        { type: '', label: 'Device ID', value: this.details?.id },
        { type: '', label: 'Model Type', value: this.details?.modelTypeName },
        { type: '', label: 'IMEI', value: this.details?.imei },
        { type: '', label: 'Device Serial', value: this.details?.serialNumber },
        { type: '', label: 'SIM Serial', value: this.details?.simCardSerial },
        { type: '', label: 'Status', value: this.details?.statusName },
        {
          type: '',
          label: 'Errand Channel',
          value: this.details?.errandChannel,
        },
        { type: '', label: 'Warehouse', value: this.details?.warehouse },
      ],
      [
        { type: '', label: 'Merchant Name', value: this.details?.merchantName },
        { type: '', label: 'Merchant ID', value: this.details?.merchantId },
        { type: '', label: 'Terminal ID', value: this.details?.terminalId },
        { type: '', label: 'Ticket ID', value: this.details?.ticketId },
        { type: '', label: 'Region', value: this.details?.region },
        { type: '', label: 'City', value: this.details?.city },
        { type: '', label: 'Zone', value: this.details?.zone },
        { type: '', label: 'Address', value: this.details?.address },
      ],
      [
        { type: '', label: 'Model Category', value: this.details?.category },
        { type: '', label: 'Shipment ID', value: this.details?.shipmentId },
        {
          type: '',
          label: 'Device Condition',
          value: this.details?.conditionName,
        },
        { type: 'date', label: 'Created At', value: this.details?.createDate },
        {
          type: 'date',
          label: 'Installed At',
          value: this.details?.installedAt,
        },
      ],
    ];
  }
  prepareCardsData() {
    this.cards.push({
      title: 'Owner',
      name: this.details?.owner,
      phone: this.details?.ownerPhone,
    });
    this.details?.warehouseManagers?.forEach((user) => {
      this.cards.push({
        title: 'Warehouse Manager',
        name: user.warehouseManager,
        phone: user.warehouseManagerPhone,
      });
    });
    this.cards.push({
      title: 'Created By',
      name: this.details?.createdBy,
      phone: this.details?.creatorPhone,
    });
    this.cards.push({
      title: 'Deployment Agent',
      name: this.details?.deploymentAgent,
      phone: this.details?.deploymentAgentPhone,
    });
  }
  backToList() {
    this.router.navigate(['main/inventory/devices/list']);
  }
}
