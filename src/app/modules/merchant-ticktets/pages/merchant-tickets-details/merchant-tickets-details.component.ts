import { Component, OnInit } from '@angular/core';
import { MerchantTicketsService } from '../../services/merchant-tickets.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TerminalService } from 'src/app/modules/terminal/services/terminal.service';
import { HttpClient } from '@angular/common/http';
import { MerchantTicketStatusEnum } from 'src/app/core/shared/core/modules/table/models/enums';

@Component({
  selector: 'app-merchant-tickets-details',
  templateUrl: './merchant-tickets-details.component.html',
  styleUrls: ['./merchant-tickets-details.component.scss'],
})
export class MerchantTicketsDetailsComponent implements OnInit {
  coordinates;
  details;
  id;
  statusStyleObj;
  MerchantTicketStatusEnum = MerchantTicketStatusEnum;
  showBlockDialog = false;
  note = '';

  showCompleteInfoDialog = false;
  merchantId = '';
  terminalId = '';
  constructor(
    private service: MerchantTicketsService,
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
    this.service.getDetailsById(id).subscribe({
      next: (res) => {
        this.details = res.data;
        this.coordinates = {
          lat: this.details?.latitude,
          lng: this.details?.longitude,
        };
        this.setStatusTagStyle();
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
      case MerchantTicketStatusEnum.New:
        statusStyle['background-color'] = '#eff8ff';
        statusStyle.color = '#175cd3';
        break;
      case MerchantTicketStatusEnum.AgentOnWay:
      case MerchantTicketStatusEnum.InProgress:
        statusStyle['background-color'] = '#fef9ee';
        statusStyle.color = '#c59e46';
        break;
      case MerchantTicketStatusEnum.Blocked:
        statusStyle['background-color'] = '#f2f4f7';
        statusStyle.color = '#344054';
        break;
      case MerchantTicketStatusEnum.NotRegistered:
        statusStyle['background-color'] = '#eff8ff';
        statusStyle.color = '#175cd3';
        break;
      case MerchantTicketStatusEnum.Completed:
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
    this.router.navigate(['/main/merchanttickets/list']);
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

  onApprove() {
    const URL = `main/ticket/addmerchantticket`;
    this.router.navigate([URL], { state: { data: this.details } });
  }

  onReject() {
    this.showBlockDialog = true;
  }
  onRejectTicket() {
    this.service
      .Reject({ ticketId: +this.id, note: this.note })
      .subscribe((res) => {
        if (res.success) {
          this.showBlockDialog = false;
          this.backToList();
        }
      });
  }
  onCompleteInfo() {
    this.service
      .CompleteInfo({
        ticketId: +this.id,
        terminalId: this.terminalId,
        merchantId: this.merchantId,
      })
      .subscribe((res) => {
        if (res.success) {
          this.showCompleteInfoDialog = false;
          this.terminalId = '';
          this.merchantId = '';
          this.getViewDetails(this.id);
        }
      });
  }
}
