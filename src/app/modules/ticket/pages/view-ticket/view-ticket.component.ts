import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { TerminalService } from 'src/app/modules/terminal/services/terminal.service';
import { HttpClient } from '@angular/common/http';
import {
  TicketCategoryEnum,
  TicketStatusEnum,
} from 'src/app/core/shared/core/modules/table/models/enums';

@Component({
  selector: 'oc-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.scss'],
})
export class ViewTicketComponent implements OnInit {
  coordinates;
  details;
  id;
  statusStyleObj;
  recuerncies = [1];
  TicketCategoryEnum = TicketCategoryEnum;
  constructor(
    private service: TicketService,
    private route: ActivatedRoute,
    private terminalService: TerminalService,
    private http: HttpClient,
    private router: Router
  ) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {
    if (this.id) {
      this.getViewDetails(this.id);
    }
  }

  getViewDetails(id) {
    this.service.getById(id).subscribe({
      next: (res) => {
        this.details = res.data;
        this.coordinates = {
          lat: this.details?.latitude,
          lng: this.details?.longitude,
        };
        this.setStatusTagStyle();
        if (this.details?.categoryId == TicketCategoryEnum.Replacement) {
          this.recuerncies.push(2);
        }
        // this.handleAddress(res);
      },
    });
  }
  setStatusTagStyle() {
    const statusStyle: { [key: string]: string } = {
      'border-radius': '16px',
      padding: '0.25rem 1rem',
      'font-weight': 'normal',
    };

    switch (this.details?.statusId) {
      case TicketStatusEnum.Assigned:
        statusStyle['background-color'] = '#eff8ff';
        statusStyle.color = '#175cd3';
        break;
      case TicketStatusEnum.AgentOnWay:
      case TicketStatusEnum.InProgress:
        statusStyle['background-color'] = '#fef9ee';
        statusStyle.color = '#c59e46';
        break;
      case TicketStatusEnum.Blocked:
        statusStyle['background-color'] = '#f2f4f7';
        statusStyle.color = '#344054';
        break;
      case TicketStatusEnum.Postponed:
        statusStyle['background-color'] = '#eff8ff';
        statusStyle.color = '#175cd3';
        break;
      case TicketStatusEnum.Completed:
        statusStyle['background-color'] = '#e0f1eb';
        statusStyle.color = '#00875a';
        break;
      default:
    }

    this.statusStyleObj = statusStyle;
  }
  handleAddress(resp: any) {
    this.coordinates = {
      lat: resp.data.latitude,
      lng: resp.data.longitude,
    };
    this.terminalService
      .GetAddressFromLatLng(resp.data.latitude, resp.data.longitude)
      .subscribe((resp: any) => {
        this.details.address = resp.address;
      });
  }
  backToList() {
    this.router.navigate(['/main/ticket/list']);
  }
  downloadImage(url, filename) {
    if (url.includes('missing')) return;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        link.href = objectUrl;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: (error) => {
        // console.error('Download failed', error);
      },
    });
  }
  getInitials(name: string): string {
    if (!name) return null;
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('');
  }
}
