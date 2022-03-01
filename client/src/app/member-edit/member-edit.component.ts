import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from '../models/member';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import { MembersService } from '../services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  member!: Member;
  user!: User;
  @ViewChild('editForm') editForm: NgForm;

  @HostListener('window:beforeunload',['$event'])
  unloadNotification($event:any){
    if(this.editForm.dirty){
      $event.returnValue=true;
    }
  }

  constructor(
    private accountService: AccountService,
    private membersService: MembersService,
    private toastr: ToastrService
  ) {
    this.accountService.currentUser$.
      pipe(take(1)).
      subscribe(user => this.user = user as User);
  }

  ngOnInit(): void {
    this.loadMember();
  }


  loadMember() {
    this.membersService.getMember(this.user.username).
      subscribe(member => {
        this.member = member;
      })
  }

  updateMember() {
    console.log(this.member);
    this.toastr.success("Profile update successfully");
    
    this.editForm.reset(this.member);//update the current status to form (=pristine)
  }

}