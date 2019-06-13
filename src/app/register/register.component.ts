import { UsersService } from './../users.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public email: String;
  public password: String;

  constructor(
    private userSevice: UsersService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async register() {
    this.userSevice.register(this.email, this.password).then(user => {
      this.toastr.success('You have successfully registered!', 'Welcome!');
      this.router.navigateByUrl('/');
    })
    .catch(({errors}) => {
      console.log(errors)
      if (errors.email && errors.password) {
        this.toastr.error(errors.email.message, 'Error!');
        this.toastr.error(errors.password.message, 'Error!');
      } if (errors.email) {
        this.toastr.error(errors.email.message, 'Error!');
      } else if (errors.password) {
        this.toastr.error(errors.password.message, 'Error!');
      }
    })
  }

}
