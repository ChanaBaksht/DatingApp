import { Component, Input, OnInit, Output, EventEmitter, DoCheck } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() usersFromComeComponent: any;
  @Output() cancelRegister = new EventEmitter<boolean>();
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  register() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: (data) => {
        this.router.navigate(['/members']);
        this.cancel();
      }, 
      error: (error) => {
        if (Array.isArray(error)) {
          this.validationErrors = error;
        }
        // error.subscribe((x: string) => {
        //   this.validationErrors = [x]
        // })
      }
      // this.toastr.error(error.error);
      // console.log(error);
    });
    console.log(this.registerForm.value);
}

cancel() {
  this.cancelRegister.emit(false);
}

initializeForm() {
  this.registerForm = this.fb.group({
    gender: ['male'],
    username: ['', Validators.required],
    knownAs: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    password: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(8)
    ]],
    confirmPassword: ['', [
      Validators.required,
      this.matchValues('password')
    ]]
  });
  this.registerForm.get('password')?.valueChanges.subscribe(() => {
    this.registerForm.get('confirmPassword')?.updateValueAndValidity();
  });
}

matchValues(matchTo: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlValue = control.value;
    const controlToMatch = (control?.parent as FormGroup)?.controls[matchTo];
    const controlToMatchValue = controlToMatch?.value;
    return controlValue == controlToMatchValue ? null : { isMatching: true };
  }
}

}
