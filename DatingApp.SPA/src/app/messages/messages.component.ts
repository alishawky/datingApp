import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/Message';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { UserService } from '../_services/User.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination = { currentPage: 1, itemsPerPage: 5, totalItems: 10, totalPages: 2 };
  messageContainer = 'Unread';

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private router: Router) { }

  ngOnInit() {

    this.loadMessages();
  }


  loadMessages() {
    this.userService.getMessages(5, this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer).subscribe((res: PaginatedResult<Message[]>) => {
      this.messages = res.result;
      // this.pagination = res.pagination;
      this.pagination = this.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }

  deleteMessage(id: number) {
    this.alertify.confirm('Are you sure you want to delete this message', () => {
      this.userService.deleteMessage(id, 5).subscribe(() => {
        this.messages.splice(_.findIndex(this.messages, { id: id }), 1);
        this.alertify.success('Message has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the message');
      });
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

}
