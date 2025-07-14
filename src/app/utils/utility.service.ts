import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private router: Router) {}

  navigate(route: string | any[]): void {
    this.router.navigate([route]);
  }
}
