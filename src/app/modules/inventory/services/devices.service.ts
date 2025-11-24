import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/http/http.service';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  controllerName = '/Device';

  getLoactionsList() {
    return this.http.getReq(this.controllerName + '/GetLocationDropDown');
  }
  getCountriesList() {
    return this.http.getReq(this.controllerName + '/GetCountryDropDown');
  }
  getBanksList() {
    return this.http.getReq(this.controllerName + '/GetBankDropDown');
  }
  getTeamDropDown() {
    return this.http.getReq(this.controllerName + '/GetTeamDropDown');
  }
  getPaymentStatusDropDown() {
    return this.http.getReq(this.controllerName + '/GetPaymentStatusDropDown');
  }

  getPaymentMethodDropDown() {
    return this.http.getReq(this.controllerName + '/GetPaymentMethodDropDown');
  }

  getSubscriptionTypeDropDown() {
    return this.http.getReq(
      this.controllerName + '/GetSubscriptionTypeDropDown'
    );
  }

  GetFile(path: string): Observable<Blob> {
    return this.http.getReq('/File/Download/' + path, {
      responseType: 'blob',
    });
  }

  public downloadFile(fileName?: string) {
    this.GetFile(fileName).subscribe((fileBlob: Blob) => {
      const blob = new Blob([fileBlob]);
      const downloadURL = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = fileName;
      link.click();

      URL.revokeObjectURL(downloadURL);
    });
  }

  getCurrencyDropDown() {
    return this.http.getReq(this.controllerName + '/GetCurrencyDropDown');
  }

  getAllModelCategories() {
    return this.http.getReq(this.controllerName + '/GetById');
  }
  constructor(private http: HttpService) {}
  add(data) {
    data.id = 0; // Ensure id is set to 0 for new entries
    return this.http.postReq(this.controllerName + '/Add', data);
  }

  getDetailsById(id) {
    return this.http.getHeaderReq(this.controllerName + '/GetById', id);
  }

  history(id) {
    return this.http.getHeaderReq(this.controllerName + '/GetHistory', id);
  }
  update(id) {
    return this.http.postReq(this.controllerName + '/Update', id);
  }

  Deploy(data) {
    return this.http.postReq(this.controllerName + '/Deploy', data);
  }
  Replace(data) {
    return this.http.postReq(this.controllerName + '/Replace', data);
  }
  Cancel(data) {
    return this.http.postReq(this.controllerName + '/Cancel', data);
  }

  UpdateDeploy(data) {
    return this.http.postReq(this.controllerName + '/UpdateDeploy', data);
  }
  UpdateReplace(data) {
    return this.http.postReq(this.controllerName + '/UpdateReplace', data);
  }
  UpdateCancel(data) {
    return this.http.postReq(this.controllerName + '/UpdateCancel', data);
  }

  Block(data) {
    return this.http.postReq(this.controllerName + '/Block', data);
  }

  getStatusDropDown() {
    return this.http.getReq(this.controllerName + '/GetStatusDropDown');
  }

  getConditionDropDown() {
    return this.http.getReq(this.controllerName + '/GetConditionDropDown');
  }

  reviewCancellation(data) {
    return this.http.postReq(this.controllerName + '/ReviewCancellation', data);
  }

  reviewDelivery(data) {
    return this.http.postReq(this.controllerName + '/ReviewDelivery', data);
  }

  returnToWarehouse(data) {
    return this.http.postReq(this.controllerName + '/ReturnToWarehouse', data);
  }

  GetHistoryLog(id) {
    return this.http.getHeaderReq(this.controllerName + '/GetHistoryLog', id);
  }

  GetHistoryLogDetails(id) {
    return this.http.getHeaderReq(
      this.controllerName + '/GetHistoryLogDetails',
      id
    );
  }

  GetDeploymentHistoryLogDetails(id) {
    return this.http.getHeaderReq('/DeploymentReport/GetHistoryLogDetails', id);
  }

  GetCancellationHistoryLogDetails(id) {
    return this.http.getHeaderReq(
      '/ReplacementReport/GetHistoryLogDetails',
      id
    );
  }

  GetReplacementHistoryLogDetails(id) {
    return this.http.getHeaderReq(
      '/CancellationReport/GetHistoryLogDetails',
      id
    );
  }
}
