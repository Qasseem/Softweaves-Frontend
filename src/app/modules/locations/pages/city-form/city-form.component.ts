import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CityService } from '../../services/city.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs';
import { TerminalService } from 'src/app/modules/terminal/services/terminal.service';

@Component({
  selector: 'oc-city-form',
  templateUrl: './city-form.component.html',
  styleUrl: './city-form.component.scss',
})
export class CityFormComponent {
  alive: boolean = true;
  form: FormGroup;
  categories = [];
  regionsList = [];
  details: any;
  id;
  formType = 'add';
  constructor(
    private fb: FormBuilder,
    private cityService: CityService,
    private router: Router,
    private route: ActivatedRoute,
    private terminalService: TerminalService
  ) {
    this.formType = this.route.snapshot.data.type;
  }
  ngOnInit() {
    const arabicLetterPattern = new RegExp(/^[\u0600-\u06FF0-9\s!@#$%^&*()]+$/);
    const englishLetterPattern = new RegExp(/^[a-zA-Z0-9\s!@#$%^&*()]+$/);
    if (this.formType == 'edit') {
      this.id = this.route.snapshot.params.id || null;
      if (this.id) {
        this.getItemDetails();
      }
    }
    this.form = this.fb.group({
      nameEn: [
        '',
        [Validators.required, Validators.pattern(englishLetterPattern)],
      ],
      nameAr: [
        '',
        [Validators.required, Validators.pattern(arabicLetterPattern)],
      ],
      regionId: [null, Validators.required],
      maxAgentTickets: [0, Validators.required],
      // isActive: [false],
      id: [null],
    });
    this.getRegionLists();
  }

  getRegionLists() {
    const regionControl = this.form.get('regionId');
    this.terminalService
      .GetAllRegions()
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.regionsList = resp.data;
            regionControl.setValue(resp.data[0].id);
          }
        },
      });
  }

  getItemDetails() {
    this.cityService
      .getDetailsById(this.id)
      .pipe(takeWhile(() => this.alive))
      .subscribe((resp) => {
        if (resp.success) {
          this.details = resp.data;
          if (this.details) {
            this.form.patchValue(this.details);
            this.form.updateValueAndValidity();
          }
        }
      });
  }
  get f() {
    return this.form.controls;
  }
  submit() {
    let obj = this.form.value;
    if (!this.id) {
      delete obj.id;
    }
    if (this.formType == 'add') {
      this.cityService
        .addCity(this.form.value)
        .pipe(takeWhile(() => this.alive))
        .subscribe({
          next: (resp) => {
            if (resp.success) {
              this.backToList();
            }
          },
        });
    } else {
      this.cityService
        .update(this.form.value)
        .pipe(takeWhile(() => this.alive))
        .subscribe({
          next: (resp) => {
            if (resp.success) {
              this.backToList();
            }
          },
        });
    }
  }
  backToList() {
    this.router.navigate(['main/locations/city/list']);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
