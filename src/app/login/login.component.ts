import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { ToastrService } from 'ngx-toastr';

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
  ) { }

  ngOnInit() {
  }

  async login() {
    this.userSevice.login(this.email, this.password).then(user => {
      console.log(user)
      this.toastr.success('Welcome back!', 'You have successfully login!');
    })
    .catch((error) => {
      console.log(error)
      this.toastr.error(error, 'Error!');
    })
  }

}
