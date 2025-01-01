import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { TerminalService } from 'src/app/modules/terminal/services/terminal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take, pipe } from 'rxjs';
import { ToastService } from 'src/app/core/services/toaster.service';

@Component({
  selector: 'app-completet-ticket',
  templateUrl: './completet-ticket.component.html',
  styleUrls: ['./completet-ticket.component.scss'],
})
export class CompletetTicketComponent implements OnInit {
  id;
  form: FormGroup;
  data: any;
  visible = false;
  options: any;
  statusOptions: any[] = [
    { name: 'Succeeded', key: 1 },
    { name: 'Failed', key: 2 },
  ];
  details: any;
  fileName: any;
  files = [];
  images = [];
  failReasons = [];
  selectedItem: any;
  isAllTasksStatusesDone: any;
  showChart: boolean;
  constructor(
    private fb: FormBuilder,
    private service: TicketService,
    private terminalService: TerminalService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastService
  ) {
    this.id = this.route.snapshot.params.id || null;
    this.getTicketDetails(this.id);
    this.buildForm();
    this.getFailedReasons();
  }
  getFailedReasons() {
    this.service.getFailReasons().subscribe((res) => {
      if (res.success) {
        this.failReasons = res.data;
      }
    });
  }
  getTicketDetails(id: any) {
    if (id) {
      this.showChart = false;
      this.service.getDeploymentStatus(id).subscribe((res) => {
        if (res.success) {
          this.details = res.data;
          this.checkForNotCompleteTasks();
          this.setChartData();
        }
      });
    }
  }

  ngOnInit() {}
  buildForm() {
    this.form = this.fb.group({
      ticketId: ['', Validators.required],
      statusId: [1, Validators.required],
      errandTypeId: [null, Validators.required],
      failReasonId: [null, Validators.required],
      terminalId: [null, Validators.required],
      posSerial: [null, Validators.required],
      imei: [null, Validators.required],
      simSerial: [null, Validators.required],
      notes: [null, Validators.required],
      images: [[], Validators.required],
      files: [[], Validators.required],
      id: [null],
      selectedTaskId: [null],
    });
  }
  backToList() {
    this.router.navigate(['main/ticket/list']);
  }
  compeletTask() {
    let obj = this.form.value;
    obj.files = this.files.map((x) => x.data);
    obj.images = this.images.map((x) => x.data);
    obj.ticketId = +this.id;
    obj.errandTypeId = this.selectedItem.errandTypeId;
    this.service
      .CompleteTicket(obj)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.getTicketDetails(this.id);
          this.visible = false;
        }
      });
  }
  setChartData() {
    var data = [
      this.details?.pending,
      this.details?.success,
      this.details?.failed,
    ];
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      datasets: [
        {
          data: [...data],
          backgroundColor: ['#E3E7EE', 'green', 'red'],
          hoverBackgroundColor: ['#E3E7EE', 'green', 'red'],
        },
      ],
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };

    this.showChart = true;
  }

  statusChange(event) {}
  get f() {
    return this.form.controls;
  }

  onFileSelectedNationalId(event: any) {
    const file = event.target.files[0];
    if (file && file.type.match('image.*')) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        let file = {
          name: this.fileName,
          data: reader.result,
        };
        this.files.push(file);
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelected(event) {
    const file = event.target.files[0];
    if (file && file.type.match('image.*')) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        let file = {
          name: this.fileName,
          data: reader.result,
        };
        this.images.push(file);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(item) {
    this.images.splice(this.images.indexOf(item), 1);
  }
  deleteFile(file) {
    this.files.splice(this.files.indexOf(file), 1);
  }
  openCompleteTaskPopup(item) {
    this.selectedItem = item;
    this.form.reset();
    this.form.controls.statusId.setValue(1);
    this.visible = true;
  }
  checkForNotCompleteTasks() {
    this.isAllTasksStatusesDone = this.details.tasks.every(
      (x) => x.statusId != 0
    );
  }
  submit() {
    if (!this.isAllTasksStatusesDone) {
      this.toaster.showError('Please complete all tasks first');
      return;
    }
    this.service.forceComplete({ ticketId: this.id }).subscribe((res) => {
      if (res.success) {
        this.backToList();
      }
    });
  }
}
