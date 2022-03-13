import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/models/member';
import { Pagination } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { UserParams } from 'src/app/models/UserParams';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  //encapsulation: ViewEncapsulation.Emulated
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  genderList = [{ value: 'male', display: "Males" }, { value: "female", display: 'Female' }];

  constructor(private memberService: MembersService, private accountService: AccountService) {
    accountService.currentUser$
      .pipe(take(1))
      .subscribe((user: any) => {
        this.user = user;
        this.userParams = new UserParams(user);
      });
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.userParams).subscribe(
      res => {
        this.members = res.result;
        this.pagination = res.pagination;
      }
    )
  }

  pageChanged({ page }: any) {
    this.userParams.pageNumber = page;
    this.loadMembers();
  }

  resetFilters() {
    this.userParams = new UserParams(this.user);
    this.loadMembers();
  }

}
