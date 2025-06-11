import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsWithoutSerialService } from '../../services/items-without-serial.service';
import { take } from 'rxjs';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';

@Component({
  selector: 'app-items-without-serial-employee-history',
  templateUrl: './items-without-serial-employee-history.component.html',
  styleUrls: ['./items-without-serial-employee-history.component.css'],
})
export class ItemsWithoutSerialEmployeeHistoryComponent implements OnInit {
  id: any;
  ownerId: any;
  details: any;
  public columns: ColumnsInterface[] = [
    {
      field: 'modelTypeId',
      header: 'ID',
      width: '50px',
    },

    {
      field: 'modelType',
      header: 'Model Type',
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
      field: 'reference',
      header: 'Reference',
      width: '100px',
      customCell: 'navTo',
      action: (row) => this.goToRef(row),
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
      .employeeHistory(this.id, this.ownerId)
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
    this.router.navigate(['main/inventory/itemswithoutserial/list']);
  }
}
