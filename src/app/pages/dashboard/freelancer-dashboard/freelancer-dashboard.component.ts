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
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';

import { DashboardService } from '../../../../service/dashboard.service';
import { JobService } from '../../../../service/job.service';
import { ProjectService } from '../../../../service/project.service';
import { PaymentService } from '../../../../service/payment.service';
import { TokenService } from '../../../utils/token.service';

@Component({
  selector: 'app-freelancer-dashboard',
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
    BadgeModule,
    CalendarModule,
    TooltipModule
  ],
  templateUrl: './freelancer-dashboard.component.html',
  styleUrls: ['./freelancer-dashboard.component.scss']
})
export class FreelancerDashboardComponent implements OnInit {
  loading = true;
  currentUser: any;

  // Dashboard Statistics
  stats = {
    activeProjects: 0,
    totalEarnings: 0,
    pendingApplications: 0,
    completedWork: 0,
    successRate: 0,
    avgRating: 0,
    this_month_earnings: 0
  };

  // Recent Activities
  recentApplications: any[] = [];
  activeWork: any[] = [];
  recentEarnings: any[] = [];
  availableOpportunities: any[] = [];

  // Chart Data
  earningsChartData: any;
  applicationStatusChartData: any;
  chartOptions: any;

  // Quick Stats
  quickStats = [
    { label: 'Active Work', value: 0, icon: 'pi-briefcase', color: 'bg-blue-100', iconColor: 'bg-blue-500', route: '/dashboard/contracts' },
    { label: 'Total Earnings', value: '$0', icon: 'pi-wallet', color: 'bg-green-100', iconColor: 'bg-green-500', route: '/dashboard/payments' },
    { label: 'Pending Applications', value: 0, icon: 'pi-clock', color: 'bg-orange-100', iconColor: 'bg-orange-500', route: '/dashboard/applications' },
    { label: 'Success Rate', value: '0%', icon: 'pi-chart-line', color: 'bg-purple-100', iconColor: 'bg-purple-500', route: '/dashboard/analytics' }
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
    // --- STATIC DATA FOR FREELANCER DASHBOARD DEMO ---
    this.loading = true;
    // Quick Stats
    this.quickStats = [
      { label: 'Active Work', value: 3, icon: 'pi-briefcase', color: 'bg-blue-100', iconColor: 'bg-blue-500', route: '/dashboard/contracts' },
      { label: 'Total Earnings', value: '$15,750', icon: 'pi-wallet', color: 'bg-green-100', iconColor: 'bg-green-500', route: '/dashboard/payments' },
      { label: 'Pending Applications', value: 2, icon: 'pi-clock', color: 'bg-orange-100', iconColor: 'bg-orange-500', route: '/dashboard/applications' },
      { label: 'Success Rate', value: '71%', icon: 'pi-chart-line', color: 'bg-purple-100', iconColor: 'bg-purple-500', route: '/dashboard/analytics' }
    ];

    // Recent Earnings
    this.recentEarnings = [
      { id: 1, amount: 850, client: 'TechCorp Inc.', project: 'E-commerce Website', date: '2025-07-20T10:00:00Z', status: 'completed', type: 'project' },
      { id: 2, amount: 400, client: 'StartupXYZ', project: 'Logo Design', date: '2025-07-18T12:00:00Z', status: 'pending', type: 'project' },
      { id: 3, amount: 1200, client: 'Digital Agency', project: 'Mobile App UI', date: '2025-07-15T09:00:00Z', status: 'completed', type: 'project' }
    ];

    // Earnings Chart Data
    this.earningsChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Monthly Earnings',
        data: [1200, 1800, 1500, 2200, 1900, 2500],
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(76, 175, 80, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    };

    // Application Status Chart Data
    this.applicationStatusChartData = {
      labels: ['Pending', 'Accepted', 'Rejected'],
      datasets: [{
        data: [2, 5, 1],
        backgroundColor: ['#FFB74D', '#66BB6A', '#EF5350'],
        hoverBackgroundColor: ['#FFCC80', '#81C784', '#F87171']
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
        this.loadChartData(),
        this.loadAvailableOpportunities()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadStatistics() {
    try {
      // Load project applications
      const projectApplications = await this.dashboardService.getMyProjectApplications().toPromise();
      const activeProjectWork = projectApplications.filter((app: any) => app.status === 'accepted');

      // Calculate pending applications
      const pendingApplications = projectApplications
        .filter((app: any) => app.status === 'pending').length;

      // Calculate success rate
      const totalApplications = projectApplications.length;
      const acceptedApplications = activeProjectWork.length;
      const successRate = totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0;

      // Mock earnings data
      const totalEarnings = 15750;
      const thisMonthEarnings = 2500;

      this.stats = {
        activeProjects: activeProjectWork.length,
        totalEarnings: totalEarnings,
        pendingApplications: pendingApplications,
        completedWork: this.calculateCompletedWork(projectApplications),
        successRate: successRate,
        avgRating: 4.8, // Mock rating
        this_month_earnings: thisMonthEarnings
      };

      // Update quick stats
      this.quickStats[0].value = this.stats.activeProjects;
      this.quickStats[1].value = this.formatCurrency(this.stats.totalEarnings);
      this.quickStats[2].value = this.stats.pendingApplications;
      this.quickStats[3].value = `${this.stats.successRate}%`;

    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  async loadRecentActivities() {
    try {
      // Load recent applications
      const projectApplications = await this.dashboardService.getMyProjectApplications().toPromise();
      
      this.recentApplications = projectApplications
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      // Load active work
      this.activeWork = projectApplications.filter((app: any) => app.status === 'accepted').slice(0, 5);

      // Mock recent earnings
      this.recentEarnings = [
        { 
          id: 1, 
          amount: 850, 
          client: 'TechCorp Inc.', 
          project: 'E-commerce Website', 
          date: new Date(), 
          status: 'completed',
          type: 'project'
        },
        { 
          id: 2, 
          amount: 400, 
          client: 'StartupXYZ', 
          project: 'Logo Design', 
          date: new Date(Date.now() - 24 * 60 * 60 * 1000), 
          status: 'pending',
          type: 'project'
        },
        { 
          id: 3, 
          amount: 1200, 
          client: 'Digital Agency', 
          project: 'Mobile App UI', 
          date: new Date(Date.now() - 48 * 60 * 60 * 1000), 
          status: 'completed',
          type: 'project'
        }
      ];

    } catch (error) {
      console.error('Error loading recent activities:', error);
    }
  }

  async loadAvailableOpportunities() {
    try {
      // Load available projects
      const availableProjects = await this.dashboardService.getAvailableProjects().toPromise();
      
      // Sort by relevance/date
      this.availableOpportunities = availableProjects
        .slice(0, 6)
        .map((project: any) => ({ ...project, type: 'project' }))
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    } catch (error) {
      console.error('Error loading opportunities:', error);
    }
  }

  async loadChartData() {
    try {
      // Mock earnings data by month
      this.earningsChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Monthly Earnings',
          data: [1200, 1800, 1500, 2200, 1900, 2500],
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(76, 175, 80, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      };

      // Application status distribution
      const projectApplications = await this.dashboardService.getMyProjectApplications().toPromise();
      const allApplications = projectApplications;

      const statusCounts = {
        pending: allApplications.filter((app: any) => app.status === 'pending').length,
        accepted: allApplications.filter((app: any) => app.status === 'accepted').length,
        rejected: allApplications.filter((app: any) => app.status === 'rejected').length
      };

      this.applicationStatusChartData = {
        labels: ['Pending', 'Accepted', 'Rejected'],
        datasets: [{
          data: [statusCounts.pending, statusCounts.accepted, statusCounts.rejected],
          backgroundColor: ['#FFB74D', '#66BB6A', '#EF5350'],
          hoverBackgroundColor: ['#FFCC80', '#81C784', '#F87171'],
          borderWidth: 0
        }]
      };

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
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };
  }

  calculateCompletedWork(projectApplications: any[]): number {
    return projectApplications
      .filter((app: any) => app.status === 'completed').length;
  }

  getStatusSeverity(status: string): any {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'danger';
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'open': return 'info';
      default: return 'info';
    }
  }

  getTypeIcon(type: string): string {
    return 'pi-folder';
  }

  getTypeColor(type: string): string {
    return 'bg-green-100 text-green-600';
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

  getSkillTags(skills: string[]): string[] {
    return skills?.slice(0, 3) || [];
  }

  // Navigation methods
  navigateToOpportunities() {
    // Navigate to browse opportunities
  }

  navigateToApplications() {
    // Navigate to applications
  }

  navigateToEarnings() {
    // Navigate to earnings/payments
  }

  applyToOpportunity(opportunity: any) {
    // Handle application logic
    console.log('Applying to:', opportunity);
  }
}
