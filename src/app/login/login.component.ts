import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: String;
  public password: String;

  constructor(
    private userSevice: UsersService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async login() {
    this.userSevice.login(this.email, this.password).then(user => {
      console.log(user)
      this.toastr.success('Welcome back!', 'You have successfully login!');
      this.router.navigateByUrl('/');
    })
    .catch((error) => {
      console.log(error)
      this.toastr.error(error, 'Error!');
    })
  }

}
