import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/http/http.service';

@Injectable({
  providedIn: 'root',
})
export class TransferCustodyService {
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
}
