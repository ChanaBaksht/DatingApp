import { Component, Input, OnInit, Output, EventEmitter, DoCheck } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  @Input() usersFromComeComponent: any;
  @Output() cancelRegister = new EventEmitter<boolean>();
  registerForm: FormGroup;

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  register() {
    // this.accountService.register(this.model).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     this.cancel();
    //   }, error: (error) => {
    //     this.toastr.error(error.error);
    //     console.log(error);
    //   }
    // });
    console.log(this.registerForm.value);
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl("Hello", Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, control => {
        const controlToMatchValue = (control?.parent as FormGroup)?.controls['password']?.value;
        return control.value == controlToMatchValue ? null : { isMatching: true };
      }]),
    });
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

}
