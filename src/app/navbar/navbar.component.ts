import { UsersService } from './../users.service';
import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public background = 'light';

  constructor(
    private usersService: UsersService,
    private elm: ElementRef,
  ) { }

  ngOnInit() {
    if(this.elm.nativeElement.getAttribute('background')) {
      this.background = this.elm.nativeElement.getAttribute('background');
    }
  }

  isLoggedIn() {
    return this.usersService.isLoggedIn();
  }

  logout() {
    this.usersService.logout();
  }

}
