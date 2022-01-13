import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  loggedIn: boolean = false;

  constructor(private accountService: AccountService) {

  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: (response) => {
        console.log(response);
      }, error: (error) => {
        console.log("Failed to login", error);
      },
      complete: () => {
        console.log("Login complete");
      }
    });
  }

  logout() {
    this.accountService.logout();
  }

  getCurrentUser() {
    this.accountService.currentUser$.subscribe((user: User | null) => {
      this.loggedIn = !!user;
    });
  }

}
