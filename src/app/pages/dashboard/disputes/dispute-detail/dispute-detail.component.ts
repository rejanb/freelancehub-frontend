import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { DialogModule } from 'primeng/dialog';
import { InputTextarea } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { DisputeService, Dispute, DisputeMessage, DisputeResolution } from '../../../../../service/dispute.service';
import { TokenService } from '../../../../utils/token.service';
import { Nl2brPipe } from '../../../../pipes/nl2br.pipe';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-dispute-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TagModule,
    TimelineModule,
    DialogModule,
    InputTextarea,
    FileUploadModule,
    Nl2brPipe,
    FormsModule
  ],
  providers: [MessageService],
  template: `
    <div class="card" *ngIf="dispute">
      <!-- Header -->
      <div class="flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="m-0">Dispute #{{ dispute.id }}</h2>
          <p class="text-500 mt-2 mb-0">{{ dispute.title }}</p>
        </div>
        <div class="flex gap-2">
          <p-tag [value]="dispute.status" [severity]="getStatusSeverity(dispute.status)"></p-tag>
          <button pButton icon="pi pi-arrow-left" label="Back" class="p-button-text" routerLink="/dashboard/disputes"></button>
        </div>
      </div>

      <div class="grid">
        <div class="col-12 md:col-8">
          <!-- Dispute Info -->
          <p-card>
            <div class="mb-3">
              <label class="block font-bold mb-2">Type</label>
              <p-tag [value]="dispute.type"></p-tag>
            </div>
            <div class="mb-3">
              <label class="block font-bold mb-2">Description</label>
              <p [innerHTML]="dispute.description | nl2br"></p>
            </div>
            <div class="mb-3">
              <label class="block font-bold mb-2">Desired Resolution</label>
              <p [innerHTML]="dispute.desired_resolution | nl2br"></p>
            </div>
            <div class="mb-3" *ngIf="dispute.resolution_amount">
              <label class="block font-bold mb-2">Resolution Amount</label>
              <span>{{ dispute.resolution_amount | currency }}</span>
            </div>
            <div class="mb-3" *ngIf="dispute.attachments && dispute.attachments.length">
              <label class="block font-bold mb-2">Attachments</label>
              <div class="flex flex-wrap gap-2">
                <a *ngFor="let att of dispute.attachments" [href]="att" target="_blank" class="p-button p-button-text">
                  <i class="pi pi-download"></i> {{ getFileName(att) }}
                </a>
              </div>
            </div>
            <div class="mb-3" *ngIf="dispute.resolution_details">
              <label class="block font-bold mb-2">Resolution Details</label>
              <p [innerHTML]="dispute.resolution_details | nl2br"></p>
            </div>
          </p-card>

          <!-- Messages Timeline -->
          <p-card class="mt-4">
            <h3>Messages</h3>
            <p-timeline [value]="messages" align="alternate" styleClass="custom-timeline">
              <ng-template pTemplate="content" let-message>
                <div class="p-3 border-round surface-ground mb-2">
                  <div class="flex justify-content-between align-items-center mb-2">
                    <span class="font-bold">{{ message.sender_name || 'User #' + message.sender }}</span>
                    <span class="text-500 text-sm">{{ message.created_at | date:'medium' }}</span>
                  </div>
                  <div [innerHTML]="message.message | nl2br"></div>
                  <div class="mt-2" *ngIf="message.attachments && message.attachments.length">
                    <a *ngFor="let att of message.attachments" [href]="att" target="_blank" class="p-button p-button-text">
                      <i class="pi pi-download"></i> {{ getFileName(att) }}
                    </a>
                  </div>
                  <div *ngIf="message.is_admin" class="mt-2 text-primary font-italic">Admin</div>
                </div>
              </ng-template>
            </p-timeline>
          </p-card>

          <!-- Add Message -->
          <p-card class="mt-4">
            <h3>Send Message</h3>
            <form (ngSubmit)="sendMessage()" class="p-fluid">
              <div class="field">
                <textarea pInputTextarea [(ngModel)]="newMessage" name="newMessage" [rows]="3" [autoResize]="true" placeholder="Type your message..."></textarea>
              </div>
              <div class="field">
                <p-fileUpload mode="basic" chooseLabel="Add Attachment" [multiple]="true" accept="image/*,application/pdf" [maxFileSize]="5000000" (onSelect)="onFileSelect($event)"></p-fileUpload>
                <small class="text-500">Max file size: 5MB. Allowed types: Images, PDF</small>
              </div>
              <button pButton type="submit" label="Send" [loading]="sending" [disabled]="!newMessage || sending"></button>
            </form>
          </p-card>

          <!-- Resolution History -->
          <p-card class="mt-4" *ngIf="resolutions && resolutions.length">
            <h3>Resolution History</h3>
            <ul>
              <li *ngFor="let res of resolutions">
                <div class="flex justify-content-between align-items-center mb-2">
                  <span class="font-bold">{{ res.resolution_type | titlecase }}</span>
                  <span class="text-500 text-sm">{{ res.created_at | date:'medium' }}</span>
                </div>
                <div *ngIf="res.amount">Amount: {{ res.amount | currency }}</div>
                <div>{{ res.description }}</div>
                <div class="mt-1">
                  <span *ngIf="res.accepted_by_initiator" class="text-success">Initiator Accepted</span>
                  <span *ngIf="res.accepted_by_respondent" class="text-success ml-2">Respondent Accepted</span>
                </div>
              </li>
            </ul>
          </p-card>
        </div>

        <div class="col-12 md:col-4">
          <!-- Parties -->
          <p-card>
            <div class="mb-4">
              <h3>Initiator</h3>
              <p class="mb-1">{{ dispute.initiator_name || 'User #' + dispute.initiator }}</p>
            </div>
            <div class="mb-4">
              <h3>Respondent</h3>
              <p class="mb-1">{{ dispute.respondent_name || 'User #' + dispute.respondent }}</p>
            </div>
            <div class="mb-4">
              <h3>Contract</h3>
              <a [routerLink]="['/dashboard/contracts', dispute.contract]" class="text-primary hover:underline">
                {{ dispute.contract_title || 'Contract #' + dispute.contract }}
              </a>
            </div>
            <div class="mb-4">
              <h3>Created</h3>
              <span>{{ dispute.created_at | date:'medium' }}</span>
            </div>
            <div class="mb-4">
              <h3>Last Updated</h3>
              <span>{{ dispute.updated_at | date:'medium' }}</span>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .custom-timeline .p-timeline-event-content {
        width: 100%;
      }
    }
  `]
})
export class DisputeDetailComponent implements OnInit {
  dispute: Dispute | null = null;
  messages: DisputeMessage[] = [];
  resolutions: DisputeResolution[] = [];
  newMessage = '';
  sending = false;
  selectedFiles: File[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private disputeService: DisputeService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const disputeId = this.route.snapshot.params['id'];
    if (!disputeId) {
      this.router.navigate(['/dashboard/disputes']);
      return;
    }
    this.loadDispute(disputeId);
    this.loadMessages(disputeId);
    this.loadResolutions(disputeId);
  }

  loadDispute(id: number) {
    this.disputeService.getDispute(id).subscribe({
      next: (dispute) => {
        this.dispute = dispute;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load dispute details'
        });
        this.router.navigate(['/dashboard/disputes']);
      }
    });
  }

  loadMessages(id: number) {
    this.disputeService.getDisputeMessages(id).subscribe({
      next: (response) => {
        this.messages = response.results;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load messages'
        });
      }
    });
  }

  loadResolutions(id: number) {
    this.disputeService.getResolutionHistory(id).subscribe({
      next: (resolutions) => {
        this.resolutions = resolutions;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load resolution history'
        });
      }
    });
  }

  sendMessage() {
    if (!this.dispute || !this.newMessage) return;
    this.sending = true;
    this.disputeService.sendMessage(this.dispute.id, this.newMessage, this.selectedFiles).subscribe({
      next: (msg) => {
        this.messages.push(msg);
        this.newMessage = '';
        this.selectedFiles = [];
        this.sending = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send message'
        });
        this.sending = false;
      }
    });
  }

  onFileSelect(event: any) {
    if (event.files) {
      this.selectedFiles = event.files;
    }
  }

  getFileName(path: string): string {
    return path.split('/').pop() || path;
  }

  getStatusSeverity(status: string): any {
    switch (status) {
      case 'open': return 'warning';
      case 'in_mediation': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'secondary';
      default: return 'secondary';
    }
  }
}
