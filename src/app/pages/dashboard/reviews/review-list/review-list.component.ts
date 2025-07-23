import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { RatingModule } from 'primeng/rating';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { MessageService } from 'primeng/api';
import { ReviewService, Review, ReviewStats } from '../../../../../service/review.service';
import { TokenService } from '../../../../utils/token.service';
import { RoleConst } from '../../../../const/api-const';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    RatingModule,
    DropdownModule,
    CalendarModule,
    ChartModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <!-- Stats Card -->
      <div class="col-12 md:col-4">
        <p-card>
          <div class="text-center mb-4">
            <h2 class="text-xl font-bold mb-2">Overall Rating</h2>
            <div class="text-4xl font-bold text-primary mb-2">
              {{ stats?.average_rating | number:'1.1-1' }}
            </div>
            <p-rating
              [ngModel]="stats?.average_rating"
              [readonly]="true"
              >
            </p-rating>
            <div class="text-500 mt-2">
              Based on {{ stats?.total_reviews }} reviews
            </div>
          </div>

          <!-- Rating Distribution -->
          <div class="mb-4">
            <h3>Rating Distribution</h3>
            <div *ngFor="let rating of [5,4,3,2,1]" class="flex align-items-center gap-2 mb-2">
              <span class="w-2rem text-right">{{ rating }}</span>
              <div class="flex-1 bg-surface-200" style="height: 8px;">
                <div
                  class="bg-primary h-full"
                  [style.width.%]="getRatingPercentage(rating)">
                </div>
              </div>
              <span class="w-3rem text-500">
              {{ stats?.rating_distribution?.[rating] || 0 }}
              </span>
            </div>
          </div>

          <!-- Detailed Ratings -->
          <div class="mb-4">
            <h3>Detailed Ratings</h3>
            <div class="grid">
              <div class="col-6 mb-3">
                <label class="block font-medium mb-2">Communication</label>
                <p-rating
                  [ngModel]="stats?.average_communication"
                  [readonly]="true"
                  >
                </p-rating>
              </div>
              <div class="col-6 mb-3">
                <label class="block font-medium mb-2">Quality</label>
                <p-rating
                  [ngModel]="stats?.average_quality"
                  [readonly]="true"
                  >
                </p-rating>
              </div>
              <div class="col-6 mb-3">
                <label class="block font-medium mb-2">Timeliness</label>
                <p-rating
                  [ngModel]="stats?.average_timeliness"
                  [readonly]="true"
                  >
                </p-rating>
              </div>
              <div class="col-6 mb-3">
                <label class="block font-medium mb-2">Professionalism</label>
                <p-rating
                  [ngModel]="stats?.average_professionalism"
                  [readonly]="true"
                  >
                </p-rating>
              </div>
            </div>
          </div>

          <!-- Recommendation -->
          <div class="text-center p-4 surface-ground border-round">
            <i class="pi pi-thumbs-up text-xl mb-2"></i>
            <div class="text-xl font-medium">
              {{ stats?.recommendation_percentage | number }}%
            </div>
            <div class="text-500">Would recommend</div>
          </div>
        </p-card>
      </div>

      <!-- Reviews List -->
      <div class="col-12 md:col-8">
        <p-card>
          <p-tabView>
            <!-- Reviews Received -->
            <p-tabPanel header="Reviews Received">
              <div class="flex justify-content-between align-items-center mb-4">
                <h2 class="m-0">Reviews Received</h2>
                <div class="flex gap-2">
                  <p-dropdown
                    [options]="sortOptions"
                    [(ngModel)]="filters.ordering"
                    placeholder="Sort by"
                    (onChange)="loadReviews()">
                  </p-dropdown>
                  <p-calendar
                    [(ngModel)]="dateRange"
                    selectionMode="range"
                    [showButtonBar]="true"
                    placeholder="Date range"
                    (onSelect)="onDateSelect()">
                  </p-calendar>
                </div>
              </div>

              <!-- Reviews -->
              <div class="reviews-container">
                <div *ngFor="let review of receivedReviews" class="mb-4 p-4 surface-ground border-round">
                  <div class="flex justify-content-between align-items-start mb-3">
                    <div>
                      <p-rating
                        [ngModel]="review.rating"
                        [readonly]="true"
                        >
                      </p-rating>
                      <div class="text-500 mt-2">
                        By {{ review.reviewer_name }} on {{ review.created_at | date }}
                      </div>
                    </div>
                    <button
                      pButton
                      icon="pi pi-external-link"
                      class="p-button-text"
                      [routerLink]="['/dashboard/reviews', review.id]">
                    </button>
                  </div>

                  <p class="line-height-3 mb-3">{{ review.review_text }}</p>

                  <div class="grid">
                    <div class="col-6 mb-2">
                      <small class="text-500">Communication:</small>
                      <p-rating
                        [ngModel]="review.communication_rating"
                        [readonly]="true"

                        [stars]="5">
                      </p-rating>
                    </div>
                    <div class="col-6 mb-2">
                      <small class="text-500">Quality:</small>
                      <p-rating
                        [ngModel]="review.quality_rating"
                        [readonly]="true"

                        [stars]="5">
                      </p-rating>
                    </div>
                    <div class="col-6 mb-2">
                      <small class="text-500">Timeliness:</small>
                      <p-rating
                        [ngModel]="review.timeliness_rating"
                        [readonly]="true"

                        [stars]="5">
                      </p-rating>
                    </div>
                    <div class="col-6 mb-2">
                      <small class="text-500">Professionalism:</small>
                      <p-rating
                        [ngModel]="review.professionalism_rating"
                        [readonly]="true"

                        [stars]="5">
                      </p-rating>
                    </div>
                  </div>

                  <div class="mt-3 flex align-items-center gap-2">
                    <i class="pi" [class.pi-thumbs-up]="review.would_recommend" [class.pi-thumbs-down]="!review.would_recommend"></i>
                    <span>{{ review.would_recommend ? 'Would recommend' : 'Would not recommend' }}</span>
                  </div>
                </div>

                <!-- Empty State -->
                <div *ngIf="receivedReviews.length === 0" class="text-center p-5">
                  <i class="pi pi-star text-6xl text-500 mb-3"></i>
                  <h3>No Reviews Yet</h3>
                  <p class="text-500">Complete contracts to receive reviews from clients.</p>
                </div>
              </div>
            </p-tabPanel>

            <!-- Reviews Given -->
            <p-tabPanel header="Reviews Given">
              <div class="flex justify-content-between align-items-center mb-4">
                <h2 class="m-0">Reviews Given</h2>
                <div class="flex gap-2">
                  <p-dropdown
                    [options]="sortOptions"
                    [(ngModel)]="filters.ordering"
                    placeholder="Sort by"
                    (onChange)="loadReviews()">
                  </p-dropdown>
                  <p-calendar
                    [(ngModel)]="dateRange"
                    selectionMode="range"
                    [showButtonBar]="true"
                    placeholder="Date range"
                    (onSelect)="onDateSelect()">
                  </p-calendar>
                </div>
              </div>

              <!-- Reviews -->
              <div class="reviews-container">
                <div *ngFor="let review of givenReviews" class="mb-4 p-4 surface-ground border-round">
                  <div class="flex justify-content-between align-items-start mb-3">
                    <div>
                      <p-rating
                        [ngModel]="review.rating"
                        [readonly]="true"
                        >
                      </p-rating>
                      <div class="text-500 mt-2">
                        For {{ review.reviewee_name }} on {{ review.created_at | date }}
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <button
                        pButton
                        icon="pi pi-pencil"
                        class="p-button-text"
                        [routerLink]="['/dashboard/reviews', review.id]">
                      </button>
                      <button
                        pButton
                        icon="pi pi-trash"
                        class="p-button-text p-button-danger"
                        (click)="deleteReview(review)">
                      </button>
                    </div>
                  </div>

                  <p class="line-height-3">{{ review.review_text }}</p>
                </div>

                <!-- Empty State -->
                <div *ngIf="givenReviews.length === 0" class="text-center p-5">
                  <i class="pi pi-star text-6xl text-500 mb-3"></i>
                  <h3>No Reviews Given</h3>
                  <p class="text-500">Review your completed contracts to help others make informed decisions.</p>
                </div>
              </div>
            </p-tabPanel>
          </p-tabView>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .reviews-container {
        max-height: 600px;
        overflow-y: auto;
      }
      .p-rating .p-rating-item.p-rating-item-active .p-rating-icon {
        color: var(--yellow-500);
      }
    }
  `]
})
export class ReviewListComponent implements OnInit {
  stats: ReviewStats | null = null;
  receivedReviews: Review[] = [];
  givenReviews: Review[] = [];
  loading = false;
  dateRange: Date[] = [];
  currentUserId?: number;
  isClient = false;

  filters = {
    ordering: '',
    start_date: '',
    end_date: '',
    page: 1,
    page_size: 10
  };

  sortOptions = [
    { label: 'Newest First', value: '-created_at' },
    { label: 'Oldest First', value: 'created_at' },
    { label: 'Highest Rating', value: '-rating' },
    { label: 'Lowest Rating', value: 'rating' }
  ];

  constructor(
    private reviewService: ReviewService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.currentUserId = currentUser?.id;
    this.isClient = currentUser?.type === RoleConst.CLIENT;

    this.loadStats();
    this.loadReviews();
  }

  loadStats() {
    if (!this.currentUserId) return;

    this.reviewService.getReviewStats(this.currentUserId).subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading review stats:', error);
      }
    });
  }

  loadReviews() {
    this.loading = true;

    // Load received reviews
    this.reviewService.getReviewsReceived().subscribe({
      next: (response) => {
        this.receivedReviews = response.results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading received reviews:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load received reviews'
        });
        this.loading = false;
      }
    });

    // Load given reviews
    this.reviewService.getReviewsGiven().subscribe({
      next: (response) => {
        this.givenReviews = response.results;
      },
      error: (error) => {
        console.error('Error loading given reviews:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load given reviews'
        });
      }
    });
  }

  onDateSelect() {
    if (this.dateRange && this.dateRange.length === 2) {
      const [start, end] = this.dateRange;
      this.filters.start_date = start.toISOString();
      this.filters.end_date = end.toISOString();
      this.loadReviews();
    }
  }

  getRatingPercentage(rating: number): number {
    if (!this.stats || !this.stats.total_reviews) return 0;
    return (this.stats.rating_distribution[rating] || 0) / this.stats.total_reviews * 100;
  }

  deleteReview(review: Review) {
    this.reviewService.deleteReview(review.id).subscribe({
      next: () => {
        this.givenReviews = this.givenReviews.filter(r => r.id !== review.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Review deleted successfully'
        });
        this.loadStats();
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
}
