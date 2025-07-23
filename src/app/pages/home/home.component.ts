import { Component, inject } from '@angular/core';
import { UtilityService } from '../../utils/utility.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    DropdownModule,
    InputTextModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  utilityService = inject(UtilityService);

  login() {
    this.utilityService.navigate('/login');
  }

  register() {
    this.utilityService.navigate('/register');
  }
  locations = [
  { label: 'Remote', value: 'Remote' },
  { label: 'Nearby', value: 'Nearby' },
  { label: 'New York', value: 'NY' },
  { label: 'California', value: 'CA' }
];



}
