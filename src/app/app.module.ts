import { UsersService } from './users.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsService } from './products.service';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CategoryNamePipe } from './category-name.pipe';
import { SortNamePipe } from './sort-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductsListComponent,
    RegisterComponent,
    NavbarComponent,
    LoginComponent,
    WishlistComponent,
    CategoryNamePipe,
    SortNamePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      maxOpened: 2,
      preventDuplicates: true,
      autoDismiss: true,
    })
  ],
  providers: [
    ProductsService,
    UsersService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
