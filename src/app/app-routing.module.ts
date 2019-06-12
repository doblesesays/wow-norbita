import { LoginComponent } from './login/login.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '',
    pathMatch: 'full',
    component: ProductsListComponent 
  },
  {
    path: 'register',
    pathMatch: 'full',
    component: RegisterComponent
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
