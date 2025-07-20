import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { AnalyticsService, EarningsStats, JobStats, ProposalStats, ContractStats } from '../../../../../service/analytics.service';
import { TokenService } from '../../../../utils/token.service';
import { RoleConst } from '../../../../const/api-const';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ChartModule,
    DropdownModule,
    CalendarModule,
    TabViewModule,
    TableModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <!-- Header -->
      <div class="col-12">
        <div class="flex justify-content-between align-items-center mb-4">
          <h2 class="m-0">Analytics Dashboard</h2>
          <div class="flex gap-2">
            <p-calendar
              [(ngModel)]="dateRange"
              selectionMode="range"
              [showButtonBar]="true"
              placeholder="Date range"
              (onSelect)="onDateSelect()"
              class="w-15rem">
            </p-calendar>
            <button 
              pButton 
              icon="pi pi-download" 
              label="Export"
              (click)="exportData()">
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="col-12 md:col-3">
        <p-card styleClass="h-full">
          <div class="text-center">
            <h3>{{ isClient ? 'Total Spent' : 'Total Earnings' }}</h3>
            <div class="text-4xl font-bold text-primary mb-3">
              {{ earningsStats?.total_earnings | currency }}
            </div>
            <div class="text-500">
              {{ earningsStats?.earnings_growth | number }}% growth
            </div>
          </div>
        </p-card>
      </div>

      <div class="col-12 md:col-3">
        <p-card styleClass="h-full">
          <div class="text-center">
            <h3>Active Jobs</h3>
            <div class="text-4xl font-bold text-primary mb-3">
              {{ jobStats?.active_jobs }}
            </div>
            <div class="text-500">
              {{ jobStats?.success_rate | number }}% success rate
            </div>
          </div>
        </p-card>
      </div>

      <div class="col-12 md:col-3">
        <p-card styleClass="h-full">
          <div class="text-center">
            <h3>Proposals</h3>
            <div class="text-4xl font-bold text-primary mb-3">
              {{ proposalStats?.total_proposals }}
            </div>
            <div class="text-500">
              {{ proposalStats?.acceptance_rate | number }}% acceptance rate
            </div>
          </div>
        </p-card>
      </div>

      <div class="col-12 md:col-3">
        <p-card styleClass="h-full">
          <div class="text-center">
            <h3>Active Contracts</h3>
            <div class="text-4xl font-bold text-primary mb-3">
              {{ contractStats?.active_contracts }}
            </div>
            <div class="text-500">
              {{ contractStats?.completion_rate | number }}% completion rate
            </div>
          </div>
        </p-card>
      </div>

      <!-- Charts -->
      <div class="col-12 md:col-8">
        <p-card>
          <p-tabView>
            <!-- Earnings Chart -->
            <p-tabPanel header="Earnings">
              <p-chart 
                type="bar" 
                [data]="earningsChartData" 
                [options]="chartOptions">
              </p-chart>
            </p-tabPanel>

            <!-- Jobs Chart -->
            <p-tabPanel header="Jobs">
              <p-chart 
                type="line" 
                [data]="jobsChartData" 
                [options]="chartOptions">
              </p-chart>
            </p-tabPanel>

            <!-- Proposals Chart -->
            <p-tabPanel header="Proposals">
              <p-chart 
                type="line" 
                [data]="proposalsChartData" 
                [options]="chartOptions">
              </p-chart>
            </p-tabPanel>
          </p-tabView>
        </p-card>
      </div>

      <!-- Performance Insights -->
      <div class="col-12 md:col-4">
        <p-card>
          <h3>Performance Insights</h3>
          <div class="insights-container">
            <div *ngFor="let insight of insights" class="mb-3">
              <i class="pi pi-info-circle text-primary mr-2"></i>
              <span>{{ insight }}</span>
            </div>
          </div>

          <h3 class="mt-4">Recommendations</h3>
          <div class="recommendations-container">
            <div *ngFor="let recommendation of recommendations" class="mb-3">
              <i class="pi pi-arrow-right text-primary mr-2"></i>
              <span>{{ recommendation }}</span>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Category Performance -->
      <div class="col-12">
        <p-card>
          <h3>Category Performance</h3>
          <p-table 
            [value]="categoryPerformance" 
            [paginator]="true" 
            [rows]="5"
            [showCurrentPageReport]="true"
            responsiveLayout="scroll">
            
            <ng-template pTemplate="header">
              <tr>
                <th>Category</th>
                <th>Jobs</th>
                <th>Earnings</th>
                <th>Success Rate</th>
                <th>Growth</th>
              </tr>
            </ng-template>

            <ng-template pTemplate="body" let-category>
              <tr>
                <td>{{ category.category }}</td>
                <td>{{ category.jobs }}</td>
                <td>{{ category.earnings | currency }}</td>
                <td>{{ category.success_rate | number }}%</td>
                <td>
                  <span [class.text-success]="category.growth > 0" [class.text-danger]="category.growth < 0">
                    {{ category.growth | number }}%
                  </span>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .insights-container, .recommendations-container {
        max-height: 200px;
        overflow-y: auto;
      }
      .text-success {
        color: var(--green-500);
      }
      .text-danger {
        color: var(--red-500);
      }
    }
  `]
})
export class AnalyticsDashboardComponent implements OnInit {
  isClient = false;
  dateRange: Date[] = [];
  earningsStats?: EarningsStats;
  jobStats?: JobStats;
  proposalStats?: ProposalStats;
  contractStats?: ContractStats;
  insights: string[] = [];
  recommendations: string[] = [];
  categoryPerformance: any[] = [];

  earningsChartData: any = {
    labels: [],
    datasets: [
      {
        label: 'Earnings',
        data: [],
        backgroundColor: '#2196F3'
      }
    ]
  };

  jobsChartData: any = {
    labels: [],
    datasets: [
      {
        label: 'Posted Jobs',
        data: [],
        borderColor: '#2196F3',
        fill: false
      },
      {
        label: 'Completed Jobs',
        data: [],
        borderColor: '#4CAF50',
        fill: false
      }
    ]
  };

  proposalsChartData: any = {
    labels: [],
    datasets: [
      {
        label: 'Sent Proposals',
        data: [],
        borderColor: '#2196F3',
        fill: false
      },
      {
        label: 'Accepted Proposals',
        data: [],
        borderColor: '#4CAF50',
        fill: false
      }
    ]
  };

  chartOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => {
            return '$' + value;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(
    private analyticsService: AnalyticsService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.isClient = currentUser?.type === RoleConst.CLIENT;

    this.loadData();
  }

  loadData() {
    const filters = this.getFilters();

    // Load earnings stats
    this.analyticsService.getEarningsStats(filters).subscribe({
      next: (stats) => {
        this.earningsStats = stats;
        this.updateEarningsChart(stats);
      },
      error: (error) => {
        console.error('Error loading earnings stats:', error);
      }
    });

    // Load job stats
    this.analyticsService.getJobStats(filters).subscribe({
      next: (stats) => {
        this.jobStats = stats;
        this.updateJobsChart(stats);
      },
      error: (error) => {
        console.error('Error loading job stats:', error);
      }
    });

    // Load proposal stats
    this.analyticsService.getProposalStats(filters).subscribe({
      next: (stats) => {
        this.proposalStats = stats;
        this.updateProposalsChart(stats);
      },
      error: (error) => {
        console.error('Error loading proposal stats:', error);
      }
    });

    // Load contract stats
    this.analyticsService.getContractStats(filters).subscribe({
      next: (stats) => {
        this.contractStats = stats;
      },
      error: (error) => {
        console.error('Error loading contract stats:', error);
      }
    });

    // Load insights and recommendations
    this.analyticsService.getPerformanceInsights().subscribe({
      next: (data) => {
        this.insights = data.insights;
        this.recommendations = data.recommendations;
      },
      error: (error) => {
        console.error('Error loading insights:', error);
      }
    });

    // Load category performance
    this.analyticsService.getCategoryPerformance().subscribe({
      next: (data) => {
        this.categoryPerformance = data;
      },
      error: (error) => {
        console.error('Error loading category performance:', error);
      }
    });
  }

  updateEarningsChart(stats: EarningsStats) {
    this.earningsChartData = {
      labels: stats.monthly_earnings.map(item => item.month),
      datasets: [
        {
          label: 'Earnings',
          data: stats.monthly_earnings.map(item => item.amount),
          backgroundColor: '#2196F3'
        }
      ]
    };
  }

  updateJobsChart(stats: JobStats) {
    this.jobsChartData = {
      labels: stats.monthly_jobs.map(item => item.month),
      datasets: [
        {
          label: 'Posted Jobs',
          data: stats.monthly_jobs.map(item => item.posted),
          borderColor: '#2196F3',
          fill: false
        },
        {
          label: 'Completed Jobs',
          data: stats.monthly_jobs.map(item => item.completed),
          borderColor: '#4CAF50',
          fill: false
        }
      ]
    };
  }

  updateProposalsChart(stats: ProposalStats) {
    this.proposalsChartData = {
      labels: stats.monthly_proposals.map(item => item.month),
      datasets: [
        {
          label: 'Sent Proposals',
          data: stats.monthly_proposals.map(item => item.sent),
          borderColor: '#2196F3',
          fill: false
        },
        {
          label: 'Accepted Proposals',
          data: stats.monthly_proposals.map(item => item.accepted),
          borderColor: '#4CAF50',
          fill: false
        }
      ]
    };
  }

  onDateSelect() {
    if (this.dateRange && this.dateRange.length === 2) {
      this.loadData();
    }
  }

  getFilters() {
    const filters: any = {};

    if (this.dateRange && this.dateRange.length === 2) {
      const [start, end] = this.dateRange;
      filters.start_date = start.toISOString();
      filters.end_date = end.toISOString();
    }

    return filters;
  }

  exportData() {
    const filters = this.getFilters();
    
    this.analyticsService.exportAnalytics('all', 'csv', filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'analytics_report.csv';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error exporting data:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to export analytics data'
        });
      }
    });
  }
} 