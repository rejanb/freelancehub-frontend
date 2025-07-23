import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReviewService, Review } from '../../../../../service/review.service';
import { TokenService } from '../../../../utils/token.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-review-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    RatingModule,
    MenuModule,
    ConfirmDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="grid">
      <div class="col-12 md:col-8 md:col-offset-2">
        <p-card *ngIf="review">
          <!-- Header -->
          <div class="flex justify-content-between align-items-center mb-4">
            <div>
              <h2 class="m-0">Review Details</h2>
              <p class="text-500 mt-2 mb-0">
                {{ review.created_at | date:'medium' }}
              </p>
            </div>
            <div class="flex gap-2">
              <button
                pButton
                icon="pi pi-arrow-left"
                label="Back"
                class="p-button-text"
                routerLink="/dashboard/reviews">
              </button>
              <button
                *ngIf="canManageReview"
                pButton
                icon="pi pi-ellipsis-v"
                class="p-button-text"
                (click)="menu.toggle($event)">
              </button>
              <p-menu #menu [popup]="true" [model]="menuItems"></p-menu>
            </div>
          </div>

          <!-- Contract Info -->
          <div class="mb-4 p-3 surface-ground border-round">
            <div class="flex justify-content-between align-items-center">
              <div>
                <label class="block font-medium mb-2">Contract</label>
                <a
                  [routerLink]="['/dashboard/contracts', review.contract]"
                  class="text-primary hover:underline">
                  {{ review.contract_title || 'Contract #' + review.contract }}
                </a>
              </div>
              <div class="text-right">
                <label class="block font-medium mb-2">Review By</label>
                <span>{{ review.reviewer_name }}</span>
              </div>
            </div>
          </div>

          <!-- Overall Rating -->
          <div class="mb-4">
            <label class="block font-bold mb-3">Overall Rating</label>
            <div class="flex align-items-center gap-3">
              <p-rating
                [ngModel]="review.rating"
                [readonly]="true"
                >
              </p-rating>
              <span class="text-xl">{{ review.rating }}/5</span>
            </div>
          </div>

          <!-- Review Text -->
          <div class="mb-4">
            <label class="block font-bold mb-3">Review</label>
            <p class="line-height-3 white-space-pre-line">{{ review.review_text }}</p>
          </div>

          <!-- Detailed Ratings -->
          <div class="grid mb-4">
            <div class="col-12 md:col-6 mb-3">
              <label class="block font-bold mb-2">Communication</label>
              <div class="flex align-items-center gap-2">
                <p-rating
                  [ngModel]="review.communication_rating"
                  [readonly]="true"
                  >
                </p-rating>
                <span>{{ review.communication_rating }}/5</span>
              </div>
            </div>

            <div class="col-12 md:col-6 mb-3">
              <label class="block font-bold mb-2">Quality</label>
              <div class="flex align-items-center gap-2">
                <p-rating
                  [ngModel]="review.quality_rating"
                  [readonly]="true"
                  >
                </p-rating>
                <span>{{ review.quality_rating }}/5</span>
              </div>
            </div>

            <div class="col-12 md:col-6 mb-3">
              <label class="block font-bold mb-2">Timeliness</label>
              <div class="flex align-items-center gap-2">
                <p-rating
                  [ngModel]="review.timeliness_rating"
                  [readonly]="true"
                  >
                </p-rating>
                <span>{{ review.timeliness_rating }}/5</span>
              </div>
            </div>

            <div class="col-12 md:col-6 mb-3">
              <label class="block font-bold mb-2">Professionalism</label>
              <div class="flex align-items-center gap-2">
                <p-rating
                  [ngModel]="review.professionalism_rating"
                  [readonly]="true"
                  >
                </p-rating>
                <span>{{ review.professionalism_rating }}/5</span>
              </div>
            </div>
          </div>

          <!-- Recommendation -->
          <div class="p-3 surface-ground border-round">
            <div class="flex align-items-center gap-2">
              <i class="pi" [class.pi-thumbs-up]="review.would_recommend" [class.pi-thumbs-down]="!review.would_recommend"></i>
              <span class="font-medium">
                {{ review.would_recommend ? 'Would recommend' : 'Would not recommend' }}
              </span>
            </div>
          </div>
        </p-card>

        <!-- Loading State -->
        <div *ngIf="loading" class="flex justify-content-center">
          <i class="pi pi-spin pi-spinner text-xl"></i>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <p-confirmDialog
      header="Confirm Action"
      icon="pi pi-exclamation-triangle"
      [style]="{ width: '450px' }">
    </p-confirmDialog>
  `,
  styles: [`
    :host ::ng-deep {
      .p-rating .p-rating-item.p-rating-item-active .p-rating-icon {
        color: var(--yellow-500);
      }
      .white-space-pre-line {
        white-space: pre-line;
      }
    }
  `]
})
export class ReviewDetailComponent implements OnInit {
  review: Review | null = null;
  loading = false;
  canManageReview = false;
  menuItems: MenuItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private tokenService: TokenService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    const reviewId = this.route.snapshot.params['id'];
    if (!reviewId) {
      this.router.navigate(['/dashboard/reviews']);
      return;
    }

    this.loadReview(reviewId);
  }

  loadReview(id: number) {
    this.loading = true;
    this.reviewService.getReview(id).subscribe({
      next: (review) => {
        this.review = review;
        this.loading = false;
        this.setupActions();
      },
      error: (error) => {
        console.error('Error loading review:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load review details'
        });
        this.router.navigate(['/dashboard/reviews']);
      }
    });
  }

  setupActions() {
    if (!this.review) return;

    const currentUser = this.tokenService.getCurrentUser();
    this.canManageReview = currentUser?.id === this.review.reviewer;

    if (this.canManageReview) {
      this.menuItems = [
        {
          label: 'Delete Review',
          icon: 'pi pi-trash',
          command: () => this.confirmDelete()
        },
        {
          label: 'Report Issue',
          icon: 'pi pi-flag',
          command: () => this.reportReview()
        }
      ];
    } else {
      this.menuItems = [
        {
          label: 'Report Issue',
          icon: 'pi pi-flag',
          command: () => this.reportReview()
        }
      ];
    }
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this review? This action cannot be undone.',
      accept: () => this.deleteReview()
    });
  }

  deleteReview() {
    if (!this.review) return;

    this.reviewService.deleteReview(this.review.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Review deleted successfully'
        });
        this.router.navigate(['/dashboard/reviews']);
      },
      error: (error) => {
        console.error('Error deleting review:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete review'
        });
      }
    });
  }

  reportReview() {
    if (!this.review) return;

    this.confirmationService.confirm({
      message: 'Please confirm if you want to report this review for inappropriate content.',
      accept: () => {
        this.reviewService.reportReview(this.review!.id, 'Inappropriate content').subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Review reported successfully'
            });
          },
          error: (error) => {
            console.error('Error reporting review:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to report review'
            });
          }
        });
      }
    });
  }
}
