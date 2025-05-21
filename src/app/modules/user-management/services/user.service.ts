import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/http/http.service';
import { DialogService } from 'src/app/services/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpService, public dialogService: DialogService) {}

  Save(data) {
    return this.http.postReq('/User/AddUser', data);
  }

  GetDetails(id) {
    return this.http.getHeaderReq('/User/GetUser', id);
  }

  getAllRolesDropdown() {
    return this.http.getReq('/Role/GetAllRolesDropDown');
  }

  getAllManagersDropdown() {
    return this.http.getReq('/User/GetAllManagerDropDown');
  }

  getAllUsers() {
    return this.http.getReq('/User/GetAllUsersDropDown');
  }

  getUsersByUserType(id) {
    return this.http.getReq('/User/GetUsersByTypeDropDown/' + id);
  }

  UpdateUser(id) {
    return this.http.postReq('/User/UpdateUser', id);
  }

  UserChangePassword(data) {
    return this.http.postReq('/User/ChangePassword', data);
  }

  getAllUsersTypeDropDown() {
    return this.http.getReq('/User/GetAllUserTypeDropDown');
  }

  getAllUsersTypeFilter() {
    return this.http.getReq('/User/GetUserTypeFilterDropDown/');
  }

  getAllSalesAgents() {
    return this.http.getReq('/User/GetAllSalesAgentsDropDown');
  }

  getAllServiceAgents() {
    return this.http.getReq('/User/GetAllServiceAgentsDropDown');
  }

  Block(data) {
    return this.http.postReq('/User/Block', data);
  }

  getAllSystemUserDropDown() {
    return this.http.getReq('/User/GetAllSystemUserDropDown');
  }

  confirm(
    msg: string = 'messages.block-item-content',
    title: string = 'messages.block-item-title',
    params = null,
    params2 = null,
    ok: string = 'OK',
    cancel: string = 'Cancel'
  ) {
    return this.dialogService.confirm(msg, title, ok, cancel, params, params2);
  }
}
