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
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
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
    ChartModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="grid">
      <!-- Header -->
      <div class="col-12">
        <div class="flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="m-0">Disputes</h2>
            <p class="text-500 mt-1 mb-0" *ngIf="isAdmin">Administrative Dispute Management</p>
            <p class="text-500 mt-1 mb-0" *ngIf="!isAdmin">My Disputes & Support</p>
          </div>
          <div class="flex gap-2">
            <button
              pButton
              icon="pi pi-plus"
              label="Create Dispute"
              class="p-button-primary"
              routerLink="create">
            </button>
            <button
              *ngIf="isAdmin"
              pButton
              icon="pi pi-cog"
              label="Admin Panel"
              class="p-button-secondary"
              routerLink="/admin/disputes">
            </button>
          </div>
        </div>


      <!-- Disputes List -->
      <div class="col-12 md:col-12">
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
                <th>Date</th>
                <th>Title</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>

                <th>Actions</th>
              </tr>
            </ng-template>

            <ng-template pTemplate="body" let-dispute>
              <tr>
                <td>{{ dispute.created_at | date:'medium' }}</td>
                <td>{{ dispute.title }}</td>
                <td>
                  <p-tag
                    [value]="dispute.dispute_type"
                    [severity]="getTypeSeverity(dispute.dispute_type)">
                  </p-tag>
                </td>
                <td>
                  <p-tag
                    [value]="dispute.priority"
                    [severity]="getStatusSeverity(dispute.status)">
                  </p-tag>
                </td>
                <td>
                  <p-tag
                    [value]="dispute.status"
                    [severity]="getStatusSeverity(dispute.status)">
                  </p-tag>
                </td>
                <td>
                  <div class="flex gap-1">
                    <button
                      pButton
                      icon="pi pi-eye"
                      class="p-button-rounded p-button-text"
                      pTooltip="View Details"
                      [routerLink]="['/dashboard/dispute', dispute.id]">
                    </button>

                    <!-- Admin Quick Actions -->
                    <ng-container *ngIf="isAdmin && dispute.status !== 'resolved' && dispute.status !== 'closed'">
                      <button
                        pButton
                        icon="pi pi-check"
                        class="p-button-rounded p-button-text p-button-success"
                        pTooltip="Quick Resolve"
                        (click)="quickResolve(dispute)">
                      </button>
                      <button
                        pButton
                        icon="pi pi-times"
                        class="p-button-rounded p-button-text p-button-danger"
                        pTooltip="Quick Reject"
                        (click)="quickReject(dispute)">
                      </button>
                    </ng-container>
                  </div>
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

    <p-confirmDialog></p-confirmDialog>
    <p-toast></p-toast>
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

  // Role-based properties
  isAdmin = false;
  isClient = false;
  isFreelancer = false;
  currentUser: any;

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


  constructor(
    private disputeService: DisputeService,
    private tokenService: TokenService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.loadData();
  }

  loadUserInfo() {
    this.currentUser = this.tokenService.getCurrentUser();
    this.isAdmin = this.currentUser?.type === 'ADMIN' || this.currentUser?.is_staff;
    this.isClient = this.currentUser?.type === RoleConst.CLIENT;
    this.isFreelancer = this.currentUser?.type === RoleConst.FREELANCER;
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
        // this.updateCharts(stats);
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


  getTypeSeverity(type: string): any {
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

  getStatusSeverity(status: string): any {
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

  // Admin Quick Actions
  quickResolve(dispute: Dispute) {
    this.confirmationService.confirm({
      message: `Are you sure you want to resolve dispute #${dispute.id}?`,
      header: 'Confirm Resolution',
      icon: 'pi pi-check-circle',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        const resolutionDetails = `Dispute #${dispute.id} resolved by administrator.`;
        this.disputeService.resolveDispute(dispute.id, resolutionDetails).subscribe({
          next: (resolvedDispute) => {
            // Update the dispute in the list
            const index = this.disputes.findIndex(d => d.id === dispute.id);
            if (index > -1) {
              this.disputes[index] = resolvedDispute;
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Dispute #${dispute.id} resolved successfully`
            });

            // Reload stats
            this.loadStats();
          },
          error: (error) => {
            console.error('Error resolving dispute:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.error || 'Failed to resolve dispute'
            });
          }
        });
      }
    });
  }

  quickReject(dispute: Dispute) {
    this.confirmationService.confirm({
      message: `Are you sure you want to reject dispute #${dispute.id}?`,
      header: 'Confirm Rejection',
      icon: 'pi pi-times-circle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        const rejectionReason = `Dispute #${dispute.id} rejected by administrator.`;
        this.disputeService.rejectDispute(dispute.id, rejectionReason).subscribe({
          next: (rejectedDispute) => {
            // Update the dispute in the list
            const index = this.disputes.findIndex(d => d.id === dispute.id);
            if (index > -1) {
              this.disputes[index] = rejectedDispute;
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Dispute #${dispute.id} rejected successfully`
            });

            // Reload stats
            this.loadStats();
          },
          error: (error) => {
            console.error('Error rejecting dispute:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.error || 'Failed to reject dispute'
            });
          }
        });
      }
    });
  }
}
