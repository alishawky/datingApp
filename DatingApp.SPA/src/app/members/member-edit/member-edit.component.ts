import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UserService } from '../../_services/User.service';
import { AlertifyService } from '../../_services/alertify.service';
import { User } from '../../_models/User';


@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user: User;
  @ViewChild('editForm') editForm: NgForm;

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private router: Router) { }

  ngOnInit() {
    this.loadUser();
  }


  loadUser() {
    this.userService.getUser(5).subscribe((user: User) => {
      this.user = user;
    }, error => {
      this.alertify.error('Problem retrieving data');
      this.router.navigate(['/members']);
    });
  }


  updateUser() {
    // console.log(this.user);

    this.userService.updateUser(this.user.id, this.user).subscribe(next => {
      this.alertify.success('Profile Updated successfully');
      this.editForm.reset(this.user);
    }, error => {
      this.alertify.error('Problem updating data');
      // this.router.navigate(['/members']);
    });
  }

}
