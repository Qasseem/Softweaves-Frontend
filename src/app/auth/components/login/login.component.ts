import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { AppTranslateService } from 'src/app/core/shared/services/translate.service';

@Component({
  selector: 'oc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private storage: StorageService,
    private router: Router,
    private appTranslateService: AppTranslateService
  ) {
    this.appTranslateService.changeLangage('en');
    this.storage.setItem('lang', 'en');
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      keepMe: [null],
    });
  }

  onSubmit() {
    let obj = {
      userName: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value,
    };
    if (this.loginForm.valid) {
      this.spinner.show();
      this.authService.login(obj).subscribe({
        next: this.handleUpdateResponse.bind(this),
        error: this.handleError.bind(this),
      });
    }
  }

  handleUpdateResponse(resp) {
    this.spinner.hide();
    if (resp.success) {
      // this.storage.clearStorage();
      this.authService.items = [];
      this.storage.setLoginData(resp);
      const url = '/main/dashboard';
      // this.permissions.syncRolesPermissions();
      this.router.navigate([url]);
    }
  }
  handleError(err) {
    this.spinner.hide();
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  goToForgotPage() {
    this.router.navigate(['/forgot']);
  }
}
