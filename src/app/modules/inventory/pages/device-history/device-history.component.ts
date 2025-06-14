import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { DevicesService } from '../../services/devices.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-device-history',
  templateUrl: './device-history.component.html',
  styleUrls: ['./device-history.component.css'],
})
export class DeviceHistoryComponent implements OnInit {
  id;
  details;
  cards = [];
  detailsSections: { type: string; label: string; value: any }[][];

  public columns: ColumnsInterface[] = [
    {
      field: 'deviceId',
      header: 'ID',
      width: '50px',
    },

    {
      field: 'notes',
      header: 'Notes',
      width: '200px',
    },
    {
      field: [
        { label: 'creator', custom: 'normal' },
        { label: 'createDate', custom: 'defaultDate' },
      ],
      header: 'Created by',
      customCell: 'multiLabel',
      width: '100px',
    },
  ];
  serial: any;

  constructor(
    private route: ActivatedRoute,
    private service: DevicesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id || null;
    this.serial = this.route.snapshot.params.serial || null;
    if (this.id) {
      this.getHistory();
    }
  }
  getHistory() {
    this.service
      .history(this.id)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.details = resp.data;
        }
      });
  }

  goToRef(row: any): any {
    throw new Error('Method not implemented.');
  }

  backToList() {
    this.router.navigate(['main/inventory/devices/list']);
  }
}
