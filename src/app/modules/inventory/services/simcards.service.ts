import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/http/http.service';

@Injectable({
  providedIn: 'root',
})
export class SimcardsService {
  controllerName = '/Simcard';
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
  getProviderDropDown() {
    return this.http.getReq(this.controllerName + '/GetProviderDropDown');
  }

  getStatusDropDown() {
    return this.http.getReq(this.controllerName + '/GetStatusDropDown');
  }
  getTypeDropDown(id) {
    return this.http.getHeaderReq(this.controllerName + '/GetTypeDropDown', id);
  }
}
