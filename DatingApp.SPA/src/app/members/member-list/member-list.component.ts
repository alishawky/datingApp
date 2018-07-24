import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/User.service';
import { Router } from '@angular/router';
import { PaginatedResult, Pagination } from '../../_models/Pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})

export class MemberListComponent implements OnInit {
  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList: [{ value: 'male', display: 'Males' }, { value: 'female', display: 'females' }];
  userParams: any = {};
  pagination: Pagination = { currentPage: 1, itemsPerPage: 5, totalItems: 10, totalPages: 2 };


  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private router: Router) { }

  ngOnInit() {
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';

    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams).subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      // this.pagination = res.pagination;
      this.pagination = this.pagination;
    }, error => {
      this.alertify.error('Problem retrieving data');
      this.router.navigate(['/home']);
    });
  }

  resetFilters() {
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;

    this.loadUsers();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

}
