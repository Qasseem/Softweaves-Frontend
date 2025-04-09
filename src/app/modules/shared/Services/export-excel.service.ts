import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import * as FileSaver from 'file-saver';
@Injectable({
  providedIn: 'root',
})
export class ExportExcelService {
  constructor() {}
  public exportAsExcelFile(
    json: any[],
    excelFileName: string,
    multipleSheets?
  ): void {
    if (multipleSheets) {
      var wb = XLSX.utils.book_new();
      json.map((item) => {
        /* create a worksheet for each array */
        var ws = XLSX.utils.json_to_sheet(item.data);
        /* Add the worksheet to the workbook */
        XLSX.utils.book_append_sheet(wb, ws, item.name);
      });
      const excelBuffer: any = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'buffer',
      });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    } else {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      const workbook: XLSX.WorkBook = {
        Sheets: { data: worksheet },
        SheetNames: ['data'],
      };
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'buffer',
      });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    }
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
