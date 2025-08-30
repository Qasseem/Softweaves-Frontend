import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/http/http.service';

@Injectable({
  providedIn: 'root',
})
export class TransferCustodyService {
  getCountriesList() {
    return this.http.getReq(this.controllerName + '/GetModelFamilyDropDown');
  }
  getUserTypes() {
    return this.http.getReq(this.controllerName + '/GetModelFamilyDropDown');
  }
  controllerName = '/transfer';
  constructor(private http: HttpService) {}
  add(data) {
    return this.http.postReq(this.controllerName + '/Add', data);
  }

  getDetailsById(id) {
    return this.http.getHeaderReq(this.controllerName + '/GetById', id);
  }

  update(id) {
    return this.http.postReq(this.controllerName + '/Update', id);
  }

  Block(data) {
    return this.http.postReq(this.controllerName + '/Block', data);
  }

  getModelTypeDetails(data) {
    return this.http.postReq(this.controllerName + '/ModelTypeDetails', data);
  }

  getModelTypeDropDown(id) {
    return this.http.getHeaderReq(
      this.controllerName + '/GetModelTypeDropDown',
      id
    );
  }

  getCategoryDropDown(id) {
    return this.http.getHeaderReq(
      this.controllerName + '/GetCategoryDropDown',
      id
    );
  }
  getModelFamilyDropDown() {
    return this.http.getReq(this.controllerName + '/GetModelFamilyDropDown');
  }

  addSerialManually(data) {
    return this.http.postReq(this.controllerName + '/AddSerialManually', data);
  }

  import(data) {
    return this.http.postReq(this.controllerName + '/import', data);
  }
  completeData(data) {
    return this.http.postReq(this.controllerName + '/CompleteData', data);
  }
  completeTransfer(data) {
    return this.http.postReq(this.controllerName + '/CompleteTransfer', data);
  }
}
