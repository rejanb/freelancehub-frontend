import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {MenubarModule} from 'primeng/menubar';
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ChartModule} from 'primeng/chart';
import {ProgressBarModule} from 'primeng/progressbar';
import {TagModule} from 'primeng/tag';
import {DashboardService} from '../../../../service/dashboard.service';
import {TokenService} from '../../../utils/token.service';
import {AdminStats, ClientStats, FreelancerStats} from '../../../model/dashboard.models';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MenubarModule,
    SidebarModule,
    ButtonModule,
    TableModule,
    CardModule,
    InputTextModule,
    PanelMenuModule,
    ChartModule,
    ProgressBarModule,
    TagModule
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  userType: string = '';
  loading = true;

  // Data containers for different user types
  adminStats!: AdminStats;
  clientStats!: ClientStats;
  freelancerStats!: FreelancerStats;

  // Chart data
  chartData: any;
  chartOptions: any;

  constructor(
    private dashboardService: DashboardService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.userType = this.tokenService.getCurrentUser()?.user_type || '';
    this.loadDashboardData();
    this.initChartOptions();
  }

  loadDashboardData() {
    this.loading = true;

    switch (this.userType) {
      case 'admin':
        this.loadAdminDashboard();
        break;
      case 'client':
        this.loadClientDashboard();
        break;
      case 'freelancer':
        this.loadFreelancerDashboard();
        break;
      default:
        this.loading = false;
    }
  }

  loadAdminDashboard() {
    Promise.all([
      this.dashboardService.getJobsAdminOverview().toPromise(),
      this.dashboardService.getProjectsAdminOverview().toPromise()
    ]).then(([jobsData, projectsData]) => {
      this.adminStats = {
        jobs: jobsData,
        projects: projectsData,
        users: {
          total: 0,
          clients: 0,
          freelancers: 0,
          admins: 0
        }
      };
      this.updateAdminCharts();
      this.loading = false;
    }).catch(error => {
      console.error('Error loading admin dashboard:', error);
      this.loading = false;
    });
  }

  loadClientDashboard() {
    Promise.all([
      this.dashboardService.getMyJobs().toPromise(),
      this.dashboardService.getMyProjects().toPromise()
    ]).then(([jobsData, projectsData]) => {
      this.clientStats = {
        myJobs: {
          total: jobsData.length,
          open: jobsData.filter((j: any) => j.status === 'open').length,
          in_progress: jobsData.filter((j: any) => j.status === 'in_progress').length,
          completed: jobsData.filter((j: any) => j.status === 'completed').length,
          applications_received: 0
        },
        myProjects: {
          total: projectsData.length,
          open: projectsData.filter((p: any) => p.status === 'open').length,
          in_progress: projectsData.filter((p: any) => p.status === 'in_progress').length,
          completed: projectsData.filter((p: any) => p.status === 'completed').length,
          proposals_received: 0
        },
        recentActivity: []
      };
      this.updateClientCharts();
      this.loading = false;
    }).catch(error => {
      console.error('Error loading client dashboard:', error);
      this.loading = false;
    });
  }

  loadFreelancerDashboard() {
    Promise.all([
      this.dashboardService.getMyJobApplications().toPromise(),
      this.dashboardService.getMyProjectApplications().toPromise(),
      this.dashboardService.getAvailableJobs().toPromise(),
      this.dashboardService.getAvailableProjects().toPromise()
    ]).then(([jobApps, projectApps, availableJobs, availableProjects]) => {
      this.freelancerStats = {
        applications: {
          jobs: jobApps.length,
          projects: projectApps.length,
          pending: [...jobApps, ...projectApps].filter((a: any) => a.status === 'pending').length,
          accepted: [...jobApps, ...projectApps].filter((a: any) => a.status === 'accepted').length,
          rejected: [...jobApps, ...projectApps].filter((a: any) => a.status === 'rejected').length,
        },
        activeWork: {
          jobs: jobApps.filter((a: any) => a.status === 'accepted').length,
          projects: projectApps.filter((a: any) => a.status === 'accepted').length,
        },
        earnings: {
          total: 0,
          thisMonth: 0,
          pending: 0
        },
        recentActivity: []
      };
      this.updateFreelancerCharts();
      this.loading = false;
    }).catch(error => {
      console.error('Error loading freelancer dashboard:', error);
      this.loading = false;
    });
  }

  updateAdminCharts() {
    if (this.adminStats) {
      this.chartData = {
        labels: ['Jobs', 'Projects'],
        datasets: [{
          data: [this.adminStats.jobs.total, this.adminStats.projects.total],
          backgroundColor: ['#42A5F5', '#66BB6A'],
          hoverBackgroundColor: ['#64B5F6', '#81C784']
        }]
      };
    }
  }

  updateClientCharts() {
    if (this.clientStats) {
      this.chartData = {
        labels: ['Open Jobs', 'In Progress Jobs', 'Completed Jobs', 'Open Projects', 'In Progress Projects', 'Completed Projects'],
        datasets: [{
          data: [
            this.clientStats.myJobs.open,
            this.clientStats.myJobs.in_progress,
            this.clientStats.myJobs.completed,
            this.clientStats.myProjects.open,
            this.clientStats.myProjects.in_progress,
            this.clientStats.myProjects.completed
          ],
          backgroundColor: ['#FFB74D', '#42A5F5', '#66BB6A', '#FF8A65', '#5C6BC0', '#26A69A']
        }]
      };
    }
  }

  updateFreelancerCharts() {
    if (this.freelancerStats) {
      this.chartData = {
        labels: ['Pending', 'Accepted', 'Rejected'],
        datasets: [{
          data: [
            this.freelancerStats.applications.pending,
            this.freelancerStats.applications.accepted,
            this.freelancerStats.applications.rejected
          ],
          backgroundColor: ['#FFB74D', '#66BB6A', '#EF5350']
        }]
      };
    }
  }

  initChartOptions() {
    this.chartOptions = {
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  getStatusSeverity(status: string): any {
    switch (status) {
      case 'open': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  }

  items = [
    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: '/' },
    { label: 'Logout', icon: 'pi pi-fw pi-sign-out' }
  ];

  menuItems = [
    {
      label: 'Management',
      icon: 'pi pi-fw pi-cog',
      items: [
        { label: 'Users', icon: 'pi pi-fw pi-users', routerLink: '/users' },
        { label: 'Reports', icon: 'pi pi-fw pi-chart-line', routerLink: '/reports' }
      ]
    }
  ];
}
