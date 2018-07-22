import { Component, OnInit } from '@angular/core';
import { User } from './_models/User';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private authService: AuthService) { }

  ngOnInit() {
    const user: User = JSON.parse(localStorage.getItem('user'));

    if (user) {
      this.authService.currentUser = user;

      if (this.authService.currentUser.photoUrl !== null) {
        this.authService.changeMemberPhoto(user.photoUrl);
      } else {
        this.authService.changeMemberPhoto('../assets/user.png');
      }
    }
  }

}


