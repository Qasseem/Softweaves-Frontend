import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DevicesService } from 'src/app/modules/inventory/services/devices.service';

@Component({
  selector: 'oc-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit, OnChanges {
  files: FileList | null = null;
  @Output() filesSelectedEvent = new EventEmitter();
  @Input() sampleName = '';
  @Input() fileUploadResponse;
  errorRecordsCount = 0;
  showFailedItemsSection = false;
  fileName: string;
  failItemsFilePsth: any;
  constructor(private deviceService: DevicesService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.fileUploadResponse?.currentValue) {
      this.errorRecordsCount =
        changes?.fileUploadResponse.currentValue?.failCount;
      this.failItemsFilePsth =
        changes?.fileUploadResponse.currentValue?.failFilePath;
      this.showFailedItemsSection = this.errorRecordsCount > 0;
    }
  }

  ngOnInit(): void {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.files = event.dataTransfer?.files;
  }

  chooseFile(): void {
    document.getElementById('file-upload').click();
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length) {
      this.fileName = files[0].name;
    }
    this.filesSelectedEvent.emit(files);
    // Handle selected files here
  }

  downloadSample() {}

  downloadFailedItemsFile() {
    this.deviceService.downloadFile(this.failItemsFilePsth);
    // window.open(this.failItemsFilePsth, '_blank');
  }
}
