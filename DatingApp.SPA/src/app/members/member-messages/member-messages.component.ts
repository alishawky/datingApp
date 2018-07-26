import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../_services/User.service';
import { AlertifyService } from '../../_services/alertify.service';
import { Message } from '../../_models/Message';
import * as _ from 'underscore';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() userId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUserId = this.authService.decodedToken.nameid;
    this.userService.getMessageThread(currentUserId, this.userId)
      .pipe(
        tap(messages => {
          _.each(messages, (message: Message) => {
            if (message.isRead === false && message.recipientId === currentUserId) {
              this.userService.markAsRead(currentUserId, message.id);
            }
          });
        })
      )
      .subscribe(messages => {
        this.messages = messages;
      }, error => {
        this.alertify.error(error);
      });
  }

  sendMessage() {
    this.newMessage.recipientId = this.userId;
    this.newMessage.senderId = this.authService.decodedToken.nameid;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage).subscribe(message => {
      this.messages.unshift(message);
      this.newMessage.content = '';
    }, error => {
      this.alertify.error(error);
    });
  }

}
