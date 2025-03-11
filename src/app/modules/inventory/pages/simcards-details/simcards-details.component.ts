import { Component, OnInit } from '@angular/core';
import { SimcardsService } from '../../services/simcards.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-simcards-details',
  templateUrl: './simcards-details.component.html',
  styleUrls: ['./simcards-details.component.css'],
})
export class SimcardsDetailsComponent implements OnInit {
  id;
  details;
  cards = [];
  detailsSections: { type: string; label: string; value: any }[][];

  constructor(
    private service: SimcardsService,
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
        { type: '', label: 'SIM ID', value: this.details?.id },
        { type: '', label: 'SIM Serial', value: this.details?.serialNumber },
        { type: '', label: 'SIM IMEI', value: this.details?.imei },
        { type: '', label: 'SIM Type', value: this.details?.typeName },
        { type: '', label: 'Provider', value: this.details?.providerName },
        { type: '', label: 'Qouta', value: this.details?.quota },
        { type: '', label: 'Status', value: this.details?.statusName },
        { type: '', label: 'Warehouse', value: this.details?.warehouse },
        {
          type: '',
          label: 'Errand Channel',
          value: this.details?.errandChannel,
        },
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
        { type: 'date', label: 'Created At', value: this.details?.createDate },
        {
          type: 'date',
          label: 'Installed At',
          value: this.details?.installedAt,
        },
        { type: '', label: 'Owner', value: this.details?.owner },
      ],
    ];
  }
  prepareCardsData() {
    this.cards.push({
      title: 'Owner',
      name: this.details?.agent,
      phone: this.details?.agentPhone,
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
    this.router.navigate(['main/inventory/simcards/list']);
  }
}
