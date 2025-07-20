import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { MessageService } from 'primeng/api';
import { DisputeService, Dispute, DisputeStats } from '../../../../../service/dispute.service';
import { TokenService } from '../../../../utils/token.service';
import { RoleConst } from '../../../../const/api-const';

@Component({
  selector: 'app-dispute-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    DropdownModule,
    CalendarModule,
    TagModule,
    ChartModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <!-- Header -->
      <div class="col-12">
        <div class="flex justify-content-between align-items-center mb-4">
          <h2 class="m-0">Disputes</h2>
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
              icon="pi pi-plus" 
              label="Create Dispute"
              routerLink="create">
            </button>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="col-12 md:col-4">
        <p-card>
          <div class="text-center mb-4">
            <h3>Dispute Statistics</h3>
            <div class="text-4xl font-bold text-primary mb-2">
              {{ stats?.total_disputes }}
            </div>
            <div class="text-500">Total Disputes</div>
          </div>

          <div class="grid">
            <div class="col-4">
              <div class="text-center">
                <div class="text-xl font-bold text-success mb-2">
                  {{ stats?.resolved_disputes }}
                </div>
                <div class="text-500">Resolved</div>
              </div>
            </div>
            <div class="col-4">
              <div class="text-center">
                <div class="text-xl font-bold text-warning mb-2">
                  {{ stats?.open_disputes }}
                </div>
                <div class="text-500">Open</div>
              </div>
            </div>
            <div class="col-4">
              <div class="text-center">
                <div class="text-xl font-bold mb-2">
                  {{ stats?.average_resolution_time | number:'1.0-0' }}d
                </div>
                <div class="text-500">Avg. Time</div>
              </div>
            </div>
          </div>

          <!-- Charts -->
          <div class="mt-4">
            <h4>Disputes by Type</h4>
            <p-chart 
              type="pie" 
              [data]="typeChartData" 
              [options]="chartOptions">
            </p-chart>
          </div>

          <div class="mt-4">
            <h4>Monthly Disputes</h4>
            <p-chart 
              type="bar" 
              [data]="monthlyChartData" 
              [options]="chartOptions">
            </p-chart>
          </div>
        </p-card>
      </div>

      <!-- Disputes List -->
      <div class="col-12 md:col-8">
        <p-card>
          <!-- Filters -->
          <div class="flex gap-2 mb-4">
            <p-dropdown
              [options]="typeOptions"
              [(ngModel)]="filters.type"
              placeholder="Filter by type"
              [showClear]="true"
              (onChange)="loadDisputes()"
              class="w-full md:w-15rem">
            </p-dropdown>

            <p-dropdown
              [options]="statusOptions"
              [(ngModel)]="filters.status"
              placeholder="Filter by status"
              [showClear]="true"
              (onChange)="loadDisputes()"
              class="w-full md:w-15rem">
            </p-dropdown>
          </div>

          <!-- Table -->
          <p-table 
            [value]="disputes" 
            [loading]="loading"
            [paginator]="true" 
            [rows]="10"
            [showCurrentPageReport]="true"
            [totalRecords]="totalRecords"
            [rowsPerPageOptions]="[10, 25, 50]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} disputes"
            (onPage)="onPageChange($event)">
            
            <ng-template pTemplate="header">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Contract</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </ng-template>

            <ng-template pTemplate="body" let-dispute>
              <tr>
                <td>
                  <a 
                    [routerLink]="['/dashboard/disputes', dispute.id]"
                    class="text-primary hover:underline">
                    #{{ dispute.id }}
                  </a>
                </td>
                <td>{{ dispute.title }}</td>
                <td>
                  <p-tag 
                    [value]="dispute.type"
                    [severity]="getTypeSeverity(dispute.type)">
                  </p-tag>
                </td>
                <td>
                  <p-tag 
                    [value]="dispute.status"
                    [severity]="getStatusSeverity(dispute.status)">
                  </p-tag>
                </td>
                <td>
                  <a 
                    [routerLink]="['/dashboard/contracts', dispute.contract]"
                    class="text-primary hover:underline">
                    {{ dispute.contract_title || 'Contract #' + dispute.contract }}
                  </a>
                </td>
                <td>{{ dispute.created_at | date:'medium' }}</td>
                <td>
                  <button 
                    pButton 
                    icon="pi pi-eye" 
                    class="p-button-rounded p-button-text"
                    [routerLink]="['/dashboard/disputes', dispute.id]">
                  </button>
                </td>
              </tr>
            </ng-template>

            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="7" class="text-center p-4">
                  No disputes found.
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
      .text-success {
        color: var(--green-500);
      }
      .text-warning {
        color: var(--yellow-500);
      }
    }
  `]
})
export class DisputeListComponent implements OnInit {
  disputes: Dispute[] = [];
  stats?: DisputeStats;
  loading = false;
  totalRecords = 0;
  dateRange: Date[] = [];

  filters = {
    type: '',
    status: '',
    start_date: '',
    end_date: '',
    page: 1,
    page_size: 10
  };

  typeOptions = [
    { label: 'Payment', value: 'payment' },
    { label: 'Quality', value: 'quality' },
    { label: 'Communication', value: 'communication' },
    { label: 'Scope', value: 'scope' },
    { label: 'Deadline', value: 'deadline' },
    { label: 'Other', value: 'other' }
  ];

  statusOptions = [
    { label: 'Open', value: 'open' },
    { label: 'In Mediation', value: 'in_mediation' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Closed', value: 'closed' }
  ];

  typeChartData: any = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#2196F3',
          '#4CAF50',
          '#FF9800',
          '#E91E63',
          '#9C27B0',
          '#607D8B'
        ]
      }
    ]
  };

  monthlyChartData: any = {
    labels: [],
    datasets: [
      {
        label: 'Opened',
        data: [],
        backgroundColor: '#2196F3'
      },
      {
        label: 'Resolved',
        data: [],
        backgroundColor: '#4CAF50'
      }
    ]
  };

  chartOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(
    private disputeService: DisputeService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadDisputes();
    this.loadStats();
  }

  loadDisputes() {
    this.loading = true;
    this.disputeService.getDisputes(this.filters).subscribe({
      next: (response) => {
        this.disputes = response.results;
        this.totalRecords = response.count;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading disputes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load disputes'
        });
        this.loading = false;
      }
    });
  }

  loadStats() {
    const filters = {
      start_date: this.filters.start_date,
      end_date: this.filters.end_date
    };

    this.disputeService.getDisputeStats(filters).subscribe({
      next: (stats) => {
        this.stats = stats;
        this.updateCharts(stats);
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  updateCharts(stats: DisputeStats) {
    // Update type chart
    this.typeChartData = {
      labels: stats.disputes_by_type.map(item => item.type),
      datasets: [
        {
          data: stats.disputes_by_type.map(item => item.count),
          backgroundColor: [
            '#2196F3',
            '#4CAF50',
            '#FF9800',
            '#E91E63',
            '#9C27B0',
            '#607D8B'
          ]
        }
      ]
    };

    // Update monthly chart
    this.monthlyChartData = {
      labels: stats.monthly_disputes.map(item => item.month),
      datasets: [
        {
          label: 'Opened',
          data: stats.monthly_disputes.map(item => item.opened),
          backgroundColor: '#2196F3'
        },
        {
          label: 'Resolved',
          data: stats.monthly_disputes.map(item => item.resolved),
          backgroundColor: '#4CAF50'
        }
      ]
    };
  }

  onPageChange(event: any) {
    this.filters.page = event.page + 1;
    this.filters.page_size = event.rows;
    this.loadDisputes();
  }

  onDateSelect() {
    if (this.dateRange && this.dateRange.length === 2) {
      const [start, end] = this.dateRange;
      this.filters.start_date = start.toISOString();
      this.filters.end_date = end.toISOString();
      this.loadData();
    }
  }

  getTypeSeverity(type: string): string {
    switch (type) {
      case 'payment':
        return 'danger';
      case 'quality':
        return 'warning';
      case 'communication':
        return 'info';
      case 'scope':
        return 'warning';
      case 'deadline':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'open':
        return 'warning';
      case 'in_mediation':
        return 'info';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'secondary';
      default:
        return 'info';
    }
  }
} 