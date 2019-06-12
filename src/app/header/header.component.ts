import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private usersService: UsersService,
  ) { }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.usersService.isLoggedIn();
  }

}
