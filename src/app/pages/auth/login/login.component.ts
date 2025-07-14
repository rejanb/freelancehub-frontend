import {Component, inject} from '@angular/core';
import {AuthService} from '../../../service/auth.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TokenService} from '../../../utils/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(private auth: AuthService, private token: TokenService) {}


  onLogin() {
    this.auth.login(this.username, this.password).subscribe((res: any) => {

      this.token.setLocal('authToken', res.auth_token);
    });
  }
}
