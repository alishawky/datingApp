import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { UserService } from '../_services/User.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: User[];
  // pagination: Pagination;
  likesParam: string;
  pagination: Pagination = { currentPage: 1, itemsPerPage: 5, totalItems: 10, totalPages: 2 };

  constructor(
    private userService: UserService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.likesParam = 'likers';

    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam)
    .subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      // this.pagination = res.pagination;
      this.pagination = this.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }


  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

}
