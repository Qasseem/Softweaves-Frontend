import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/core/http/http.service';

@Component({
  selector: 'history-log',
  templateUrl: './history-log.component.html',
  styleUrls: ['./history-log.component.css'],
})
export class HistoryLogComponent implements OnInit {
  HistoryLogSApis: Record<string, any> = {
    Tickets: {
      api: '/Ticket/GetHistory/',
      listUlr: 'main/ticket/list',
      header: 'Ticket',
    },
  };
  id;
  data = [];
  type: any;
  pageInfo: any;
  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private router: Router
  ) {
    this.id = this.route.snapshot.params.id || null;
    this.type = this.route.snapshot.params.type || null;
    if (this.id && this.type) {
      this.pageInfo = this.HistoryLogSApis[this.type];
      this.getData();
    }
  }
  getData() {
    this.http
      .getReq(this.HistoryLogSApis.Tickets.api + this.id)
      .subscribe((res) => {
        if (res.success) {
          this.data = res.data;
        }
      });
  }

  ngOnInit() {}

  backToList() {
    this.router.navigate([this.pageInfo.listUlr]);
  }
}
