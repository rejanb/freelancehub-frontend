import {Component, inject} from '@angular/core';
import {AuthService} from '../../../service/auth.service';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TokenService} from '../../../utils/token.service';
import {ApiConst} from '../../../const/api-const';
import {ButtonDirective} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {Password} from "primeng/password";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive, ButtonDirective, DropdownModule, InputText, Message, Password, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(private auth: AuthService, private token: TokenService,  private router: Router) {}


  onLogin() {
    this.auth.login(this.email, this.password).subscribe((res: any) => {
      console.log('Login successful:', res);
      console.log('User:', {name: res.user, type: res.user_type, email: res.email, id: res.id});
      this.token.setLocal(ApiConst.userKey,   {name: res.user, type: res.user_type, email: res.email, id: res.id});
      this.token.setLocal(ApiConst.tokenKey, {refresh: res.refresh, access: res.access});
      this.router.navigate(['dashboard']);

    });
  }
}
