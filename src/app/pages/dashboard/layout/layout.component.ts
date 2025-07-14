import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from '../../../service/auth.service';
import {TokenService} from '../../../utils/token.service';
import {ApiConst} from '../../../const/api-const';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  constructor(private auth: AuthService, private router: Router,private token: TokenService) {}


  onLogout() {
    const refresh = this.token.getToken().refresh;
    if (refresh)  {
      this.auth.logout(refresh).subscribe((res: any) => {
        console.log('Logout successful:', res);
        this.token.clearLocal(ApiConst.userKey);
        this.token.clearLocal(ApiConst.tokenKey);
        this.router.navigate(['login']);
      }, (error: any) => {
        console.error('Logout failed:', error);
      });

    }

  }

}
