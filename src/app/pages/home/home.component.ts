import {Component, inject} from '@angular/core';
import {UtilityService} from '../../utils/utility.service';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {PanelModule} from 'primeng/panel';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports:  [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, ButtonModule, PanelModule, CardModule, CarouselModule],
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

  features = [
    {
      title: 'Workspace Canvas',
      subtitle: 'Visual Project Management',
      description: 'Drag and drop cards for projects, jobs, and contracts.'
    },
    {
      title: 'Timeline View',
      subtitle: 'Stay on Track',
      description: 'See all milestones and deadlines at a glance.'
    },
    {
      title: 'Collaboration Tools',
      subtitle: 'Work Together',
      description: 'Notes, to-do lists, and file sharing per project.'
    },
    {
      title: 'Activity Feed',
      subtitle: 'Real-Time Updates',
      description: 'Instant notifications for proposals, messages, and payments.'
    }
  ];
}
