import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnsInterface } from 'src/app/core/shared/core/modules/table/models/columns.interface';
import { MerchantTicketsService } from '../../services/merchant-tickets.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-merchant-ticket-history',
  templateUrl: './merchant-ticket-history.component.html',
  styleUrls: ['./merchant-ticket-history.component.css'],
})
export class MerchantTicketHistoryComponent implements OnInit {
  id: any;
  ownerId: any;
  details: any;
  public columns: ColumnsInterface[] = [
    {
      field: 'id',
      header: 'ID',
      width: '50px',
    },

    {
      field: 'statusName',
      header: 'Status',
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
  constructor(
    private route: ActivatedRoute,
    private service: MerchantTicketsService,
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
      .History(this.id)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.details = resp.data;
        }
      });
  }

  backToList() {
    this.router.navigate(['main/merchanttickets/list']);
  }
}
