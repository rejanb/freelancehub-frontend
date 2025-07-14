import {Component, inject} from '@angular/core';
import {UtilityService} from '../../utils/utility.service';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports:  [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

 utilityService=inject(UtilityService);
  login() {
    this.utilityService.navigate('/login');
  }

  register() {
    this.utilityService.navigate('/register');
  }
}
