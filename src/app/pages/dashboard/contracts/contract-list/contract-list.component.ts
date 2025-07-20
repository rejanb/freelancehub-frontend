import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ContractService, ContractFilters } from '../../../../../service/contract.service';
import { TokenService } from '../../../../utils/token.service';
import { RoleConst } from '../../../../const/api-const';
import { Contract } from '../../../../model/models';

interface ContractListFilters {
  search: string;
  status: 'active' | 'completed' | 'cancelled' | null;
  dateRange: Date[] | null;
  sort: string | null;
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    TableModule,
    CardModule,
    TagModule,
    DropdownModule,
    CalendarModule,
    InputTextModule
  ],
  providers: [MessageService],
  template: `
    <div class="card">
      <!-- Header -->
      <div class="flex justify-content-between align-items-center mb-4">
        <h2>Contracts</h2>
        <div class="flex gap-2">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input 
              type="text" 
              pInputText 
              [(ngModel)]="filters.search" 
              (input)="onSearch()"
              placeholder="Search contracts...">
          </span>
        </div>
      </div>

      <!-- Filters -->
      <div class="grid mb-4">
        <div class="col-12 md:col-3">
          <p-dropdown
            [options]="statusOptions"
            [(ngModel)]="filters.status"
            (onChange)="loadContracts()"
            placeholder="Status"
            [showClear]="true"
            class="w-full">
          </p-dropdown>
        </div>

        <div class="col-12 md:col-3">
          <p-calendar
            [(ngModel)]="filters.dateRange"
            selectionMode="range"
            [showButtonBar]="true"
            (onSelect)="onDateSelect()"
            placeholder="Date range"
            class="w-full">
          </p-calendar>
        </div>

        <div class="col-12 md:col-3">
          <p-dropdown
            [options]="sortOptions"
            [(ngModel)]="filters.sort"
            (onChange)="loadContracts()"
            placeholder="Sort by"
            [showClear]="true"
            class="w-full">
          </p-dropdown>
        </div>
      </div>

      <!-- Contracts Table -->
      <p-table 
        [value]="contracts" 
        [loading]="loading"
        [paginator]="true" 
        [rows]="10"
        [showCurrentPageReport]="true"
        [totalRecords]="totalRecords"
        [rowsPerPageOptions]="[10, 25, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} contracts"
        (onPage)="onPageChange($event)">
        
        <ng-template pTemplate="header">
          <tr>
            <th>Contract ID</th>
            <th>{{ isClient ? 'Freelancer' : 'Client' }}</th>
            <th>Project</th>
            <th>Amount</th>
            <th>Start Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-contract>
          <tr>
            <td>
              <a 
                [routerLink]="['/dashboard/contracts', contract.id]"
                class="text-primary hover:underline">
                #{{ contract.id }}
              </a>
            </td>
            <td>
              {{ isClient ? contract.freelancer?.username : contract.client?.username }}
            </td>
            <td>{{ contract.proposal?.job?.title }}</td>
            <td>{{ contract.total_payment | currency }}</td>
            <td>{{ contract.start_date | date }}</td>
            <td>
              <p-tag 
                [value]="contract.status"
                [severity]="getStatusSeverity(contract.status)">
              </p-tag>
            </td>
            <td>
              <div class="flex gap-2">
                <button 
                  pButton 
                  icon="pi pi-eye" 
                  class="p-button-rounded p-button-text"
                  [routerLink]="['/dashboard/contracts', contract.id]"
                  pTooltip="View Details">
                </button>
                <button 
                  pButton 
                  icon="pi pi-list" 
                  class="p-button-rounded p-button-text"
                  [routerLink]="['/dashboard/contracts', contract.id, 'milestones']"
                  pTooltip="View Milestones">
                </button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="text-center p-4">
              No contracts found.
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-dropdown {
        width: 100%;
      }
      .p-calendar {
        width: 100%;
      }
    }
  `]
})
export class ContractListComponent implements OnInit {
  contracts: Contract[] = [];
  loading = false;
  totalRecords = 0;
  isClient = false;

  filters: ContractListFilters = {
    search: '',
    status: null,
    dateRange: null,
    sort: null,
    page: 1,
    pageSize: 10
  };

  statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  sortOptions = [
    { label: 'Newest First', value: '-created_at' },
    { label: 'Oldest First', value: 'created_at' },
    { label: 'Amount: High to Low', value: '-total_payment' },
    { label: 'Amount: Low to High', value: 'total_payment' }
  ];

  constructor(
    private contractService: ContractService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.isClient = currentUser?.type === RoleConst.CLIENT;
    this.loadContracts();
  }

  loadContracts(page = 1) {
    this.loading = true;
    
    const filters: ContractFilters = {
      page: this.filters.page,
      page_size: this.filters.pageSize,
      ordering: this.filters.sort || undefined,
      status: this.filters.status || undefined
    };

    if (this.filters.search) {
      filters.search = this.filters.search;
    }

    if (this.filters.dateRange && this.filters.dateRange.length === 2) {
      const [start, end] = this.filters.dateRange;
      if (start) filters.start_date_from = start.toISOString();
      if (end) filters.start_date_to = end.toISOString();
    }

    this.contractService.getContracts(filters).subscribe({
      next: (response) => {
        this.contracts = response.results;
        this.totalRecords = response.count;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading contracts:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load contracts'
        });
        this.loading = false;
      }
    });
  }

  onSearch() {
    // Debounce search
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.filters.page = 1;
      this.loadContracts();
    }, 300);
  }

  onPageChange(event: any) {
    this.filters.page = event.page + 1;
    this.filters.pageSize = event.rows;
    this.loadContracts();
  }

  onDateSelect() {
    this.filters.page = 1;
    this.loadContracts();
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'warning';
    }
  }

  private searchTimeout: any;
} 