import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/http/http.service';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  controllerName = '/Device';
  getAllModelCategories() {
    return this.http.getReq(this.controllerName + '/GetById');
  }
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

  getStatusDropDown() {
    return this.http.getReq(this.controllerName + '/GetStatusDropDown');
  }

  getConditionDropDown() {
    return this.http.getReq(this.controllerName + '/GetConditionDropDown');
  }
}
