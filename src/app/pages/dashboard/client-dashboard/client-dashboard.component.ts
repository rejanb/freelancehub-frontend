import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';
import { TimelineModule } from 'primeng/timeline';
import { BadgeModule } from 'primeng/badge';

import { DashboardService } from '../../../../service/dashboard.service';
import { JobService } from '../../../../service/job.service';
import { ProjectService } from '../../../../service/project.service';
import { PaymentService } from '../../../../service/payment.service';
import { TokenService } from '../../../utils/token.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    ChartModule,
    ProgressBarModule,
    SkeletonModule,
    AvatarModule,
    TimelineModule,
    BadgeModule
  ],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  loading = true;
  currentUser: any;

  // Dashboard Statistics
  stats = {
    activeProjects: 0,
    totalSpent: 0,
    pendingApplications: 0,
    completedWork: 0,
    avgProjectDuration: 0
  };

  // Recent Activities
  recentProjects: any[] = [];
  recentPayments: any[] = [];
  recentApplications: any[] = [];

  // Chart Data
  spendingChartData: any;
  projectStatusChartData: any;
  chartOptions: any;

  // Quick Actions
  quickStats = [
    { label: 'Active Projects', value: 0, icon: 'pi-folder', color: 'bg-green-100', iconColor: 'bg-green-500', route: '/dashboard/projects' },
    { label: 'Total Spent', value: '$0', icon: 'pi-wallet', color: 'bg-purple-100', iconColor: 'bg-purple-500', route: '/dashboard/payments' },
    { label: 'Applications', value: 0, icon: 'pi-users', color: 'bg-orange-100', iconColor: 'bg-orange-500', route: '/dashboard/projects' },
    { label: 'Completed Work', value: 0, icon: 'pi-check-circle', color: 'bg-blue-100', iconColor: 'bg-blue-500', route: '/dashboard/projects' }
  ];

  constructor(
    private dashboardService: DashboardService,
    private jobService: JobService,
    private projectService: ProjectService,
    private paymentService: PaymentService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.currentUser = this.tokenService.getCurrentUser();
    // --- STATIC DATA FOR CLIENT DASHBOARD DEMO ---
    this.loading = true;
    // Quick Stats
    this.quickStats = [
      { label: 'Active Projects', value: 2, icon: 'pi-folder', color: 'bg-green-100', iconColor: 'bg-green-500', route: '/dashboard/projects' },
      { label: 'Total Spent', value: '$7,100', icon: 'pi-wallet', color: 'bg-purple-100', iconColor: 'bg-purple-500', route: '/dashboard/payments' },
      { label: 'Applications', value: 7, icon: 'pi-users', color: 'bg-orange-100', iconColor: 'bg-orange-500', route: '/dashboard/projects' },
      { label: 'Completed Work', value: 3, icon: 'pi-check-circle', color: 'bg-blue-100', iconColor: 'bg-blue-500', route: '/dashboard/projects' }
    ];

    // Recent Projects
    this.recentProjects = [
      { title: 'Website Redesign', budget: 1200, status: 'in_progress', created_at: '2025-07-01T10:00:00Z', deadline: '2025-08-01T10:00:00Z' },
      { title: 'SEO Optimization', budget: 800, status: 'open', created_at: '2025-07-10T12:00:00Z', deadline: '2025-08-10T12:00:00Z' },
      { title: 'Mobile App Launch', budget: 3000, status: 'completed', created_at: '2025-06-15T09:00:00Z', deadline: '2025-07-15T09:00:00Z' }
    ];

    // Recent Payments
    this.recentPayments = [
      { id: 1, amount: 500, recipient: 'John Doe', project: 'Website Design', date: '2025-07-20T10:00:00Z', status: 'completed' },
      { id: 2, amount: 750, recipient: 'Jane Smith', project: 'Mobile App', date: '2025-07-18T12:00:00Z', status: 'pending' },
      { id: 3, amount: 300, recipient: 'Mike Johnson', project: 'Logo Design', date: '2025-07-15T09:00:00Z', status: 'completed' }
    ];

    // Spending Chart Data
    this.spendingChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Monthly Spending',
        data: [1200, 1900, 800, 1500, 2000, 1700],
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        borderColor: 'rgba(66, 165, 245, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    };

    // Project Status Chart Data
    this.projectStatusChartData = {
      labels: ['Open', 'In Progress', 'Completed', 'Cancelled'],
      datasets: [{
        data: [1, 2, 3, 0],
        backgroundColor: ['#FFB74D', '#42A5F5', '#66BB6A', '#EF5350'],
        hoverBackgroundColor: ['#FFCC80', '#64B5F6', '#81C784', '#F87171']
      }]
    };

    this.initChartOptions();
    this.loading = false;
    // --- END STATIC DATA BLOCK ---
    // Comment out the following for static demo:
    // this.loadDashboardData();
  }

  async loadDashboardData() {
    this.loading = true;
    try {
      await Promise.all([
        this.loadStatistics(),
        this.loadRecentActivities(),
        this.loadChartData()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadStatistics() {
    try {
      // Load projects statistics
      const myProjects = await this.dashboardService.getMyProjects().toPromise();
      const activeProjects = myProjects.filter((project: any) => 
        project.status === 'open' || project.status === 'in_progress'
      );

      // Calculate pending applications for projects
      const totalApplications = myProjects.reduce((sum: number, project: any) => 
        sum + (project.proposals_received || 0), 0
      );

      // Calculate completed work
      const completedWork = myProjects.filter((project: any) => project.status === 'completed').length;

      // Update stats
      this.stats = {
        activeProjects: activeProjects.length,
        totalSpent: 0, // Will be updated when payment data is loaded
        pendingApplications: totalApplications,
        completedWork: completedWork,
        avgProjectDuration: this.calculateAverageProjectDuration(myProjects)
      };

      // Update quick stats
      this.quickStats[0].value = this.stats.activeProjects;
      this.quickStats[2].value = this.stats.pendingApplications;
      this.quickStats[3].value = this.stats.completedWork;

    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  async loadRecentActivities() {
    try {
      // Load recent projects
      const myProjects = await this.dashboardService.getMyProjects().toPromise();
      this.recentProjects = myProjects
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      // Load recent payments (mock data for now)
      this.recentPayments = [
        { id: 1, amount: 500, recipient: 'John Doe', project: 'Website Design', date: new Date(), status: 'completed' },
        { id: 2, amount: 750, recipient: 'Jane Smith', project: 'Mobile App', date: new Date(), status: 'pending' },
        { id: 3, amount: 300, recipient: 'Mike Johnson', project: 'Logo Design', date: new Date(), status: 'completed' }
      ];

    } catch (error) {
      console.error('Error loading recent activities:', error);
    }
  }

  async loadChartData() {
    try {
      // Mock spending data by month
      this.spendingChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Monthly Spending',
          data: [1200, 1900, 800, 1500, 2000, 1700],
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          borderColor: 'rgba(66, 165, 245, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      };

      // Project status distribution
      const myProjects = await this.dashboardService.getMyProjects().toPromise();
      const statusCounts = {
        open: myProjects.filter((p: any) => p.status === 'open').length,
        in_progress: myProjects.filter((p: any) => p.status === 'in_progress').length,
        completed: myProjects.filter((p: any) => p.status === 'completed').length,
        cancelled: myProjects.filter((p: any) => p.status === 'cancelled').length
      };

      this.projectStatusChartData = {
        labels: ['Open', 'In Progress', 'Completed', 'Cancelled'],
        datasets: [{
          data: [statusCounts.open, statusCounts.in_progress, statusCounts.completed, statusCounts.cancelled],
          backgroundColor: ['#FFB74D', '#42A5F5', '#66BB6A', '#EF5350'],
          hoverBackgroundColor: ['#FFCC80', '#64B5F6', '#81C784', '#F87171']
        }]
      };

      // Update total spent
      const totalSpent = this.spendingChartData.datasets[0].data.reduce((sum: number, value: number) => sum + value, 0);
      this.stats.totalSpent = totalSpent;
      this.quickStats[1].value = `$${totalSpent.toLocaleString()}`;

    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  }

  initChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  calculateAverageProjectDuration(projects: any[]): number {
    const completedProjects = projects.filter(p => p.status === 'completed');
    if (completedProjects.length === 0) return 0;

    const totalDays = completedProjects.reduce((sum, project) => {
      const start = new Date(project.created_at);
      const end = new Date(project.deadline);
      const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return sum + duration;
    }, 0);

    return Math.round(totalDays / completedProjects.length);
  }

  getStatusSeverity(status: string): any {
    switch (status) {
      case 'open': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      case 'pending': return 'warning';
      default: return 'info';
    }
  }

  formatDate(date: any): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'job': return 'pi-briefcase';
      case 'project': return 'pi-folder';
      case 'payment': return 'pi-wallet';
      case 'application': return 'pi-user';
      default: return 'pi-info-circle';
    }
  }

  // Quick action methods
  navigateToCreateProject() {
    // Navigate to project creation
  }

  navigateToPayments() {
    // Navigate to payments
  }

  navigateToMessages() {
    // Navigate to messages
  }
}
