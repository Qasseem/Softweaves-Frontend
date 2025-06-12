import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsWithoutSerialService } from '../../services/items-without-serial.service';
import { take } from 'rxjs';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';

@Component({
  selector: 'app-items-without-serial-warehouse-history',
  templateUrl: './items-without-serial-warehouse-history.component.html',
  styleUrls: ['./items-without-serial-warehouse-history.component.css'],
})
export class ItemsWithoutSerialWarehouseHistoryComponent implements OnInit {
  id: any;
  ownerId: any;
  details: any;
  public columns: ColumnsInterface[] = [
    {
      field: 'deviceId',
      header: 'ID',
      width: '50px',
    },

    {
      field: 'actionName',
      header: 'Action Type',
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
    {
      field: 'oldQuantity',
      header: 'Old QTY',
      width: '100px',
    },
    {
      field: 'quantity',
      header: 'New QTY',
      width: '100px',
    },
  ];
  constructor(
    private route: ActivatedRoute,
    private service: ItemsWithoutSerialService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id || null;
    this.ownerId = this.route.snapshot.params.ownerId || null;
    if (this.id) {
      this.getHistory();
    }
  }
  getHistory() {
    this.service
      .warehouseHistory(this.id, this.ownerId)
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
    this.router.navigate([
      `main/inventory/itemswithoutserial/warehouse/${this.id}`,
    ]);
  }
}
