import {Component, inject} from '@angular/core';
import {UtilityService} from '../../utils/utility.service';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {PanelModule} from 'primeng/panel';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';
import {DividerModule} from 'primeng/divider';
import {AvatarModule} from 'primeng/avatar';
import { PublicNavComponent } from '../../components/public-nav/public-nav.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    RouterModule, 
    ButtonModule, 
    PanelModule, 
    CardModule, 
    CarouselModule,
    DividerModule,
    AvatarModule,
    PublicNavComponent
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

  features = [
    {
      title: 'Smart Project Management',
      subtitle: 'Organize & Track',
      description: 'Advanced project tracking with milestones, deadlines, and progress monitoring.',
      icon: 'pi pi-chart-line'
    },
    {
      title: 'Secure Payments',
      subtitle: 'Safe & Fast',
      description: 'Escrow-based payment system ensuring secure transactions for all parties.',
      icon: 'pi pi-shield'
    },
    {
      title: 'Real-time Communication',
      subtitle: 'Stay Connected',
      description: 'Built-in messaging, notifications, and collaboration tools.',
      icon: 'pi pi-comments'
    },
    {
      title: 'Quality Assurance',
      subtitle: 'Excellence Guaranteed',
      description: 'Review system and dispute resolution to maintain high quality standards.',
      icon: 'pi pi-star'
    }
  ];

  stats = [
    { value: '10K+', label: 'Active Freelancers', icon: 'pi pi-users' },
    { value: '5K+', label: 'Completed Projects', icon: 'pi pi-check-circle' },
    { value: '98%', label: 'Client Satisfaction', icon: 'pi pi-heart' },
    { value: '$2M+', label: 'Total Earnings', icon: 'pi pi-dollar' }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechCorp',
      content: 'FreelanceHub transformed how we work with freelancers. The platform is intuitive and professional.',
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Full Stack Developer',
      company: 'Freelancer',
      content: 'Best platform I\'ve used for finding quality projects. The payment system is reliable and fast.',
      avatar: 'MC'
    },
    {
      name: 'Emma Davis',
      role: 'UX Designer',
      company: 'Creative Agency',
      content: 'The collaboration tools are excellent. Communication with clients has never been smoother.',
      avatar: 'ED'
    }
  ];
}
