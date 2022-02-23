import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  // loggedIn: boolean = false;
  currentUser$: Observable<User | null>;

  constructor(private accountService: AccountService, private router: Router, private toastr: ToastrService) {
    this.currentUser$ = this.accountService.currentUser$;
  }

  ngOnInit(): void {
    // this.getCurrentUser();
  }

  login() {
    this.accountService.login(this.model)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl('/members');
          console.log(response);
        }
      });
  }

  logout() {
    this.router.navigateByUrl('/');
    this.accountService.logout();
  }

  // getCurrentUser() {
  //   this.accountService.currentUser$.subscribe((user: User | null) => {
  //     this.loggedIn = !!user;
  //   });
  // }

}
