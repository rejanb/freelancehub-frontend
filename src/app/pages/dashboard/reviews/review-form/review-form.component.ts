import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { InputTextarea } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ReviewService, Review } from '../../../../../service/review.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    RatingModule,
    InputTextarea,
    CheckboxModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <div class="col-12 md:col-8 md:col-offset-2">
        <p-card>
          <div class="flex justify-content-between align-items-center mb-4">
            <h2 class="m-0">Write a Review</h2>
            <button
              pButton
              icon="pi pi-arrow-left"
              label="Back"
              class="p-button-text"
              routerLink="/dashboard/reviews">
            </button>
          </div>

          <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" class="p-fluid">
            <!-- Overall Rating -->
            <div class="field">
              <label class="block font-bold mb-2">Overall Rating *</label>
              <p-rating
                formControlName="rating"

                [stars]="5">
              </p-rating>
              <small
                class="p-error"
                *ngIf="reviewForm.get('rating')?.invalid && reviewForm.get('rating')?.touched">
                Overall rating is required
              </small>
            </div>

            <!-- Review Text -->
            <div class="field">
              <label class="block font-bold mb-2">Review *</label>
              <textarea
                pInputTextarea
                formControlName="review_text"
                [rows]="5"
                [autoResize]="true"
                placeholder="Share your experience..."
                [class.ng-invalid]="reviewForm.get('review_text')?.invalid && reviewForm.get('review_text')?.touched">
              </textarea>
              <small
                class="p-error"
                *ngIf="reviewForm.get('review_text')?.invalid && reviewForm.get('review_text')?.touched">
                Review text is required (minimum 20 characters)
              </small>
            </div>

            <!-- Detailed Ratings -->
            <div class="grid">
              <div class="col-12 md:col-6 field">
                <label class="block font-bold mb-2">Communication *</label>
                <p-rating
                  formControlName="communication_rating"

                  [stars]="5">
                </p-rating>
                <small
                  class="p-error"
                  *ngIf="reviewForm.get('communication_rating')?.invalid && reviewForm.get('communication_rating')?.touched">
                  Communication rating is required
                </small>
              </div>

              <div class="col-12 md:col-6 field">
                <label class="block font-bold mb-2">Quality *</label>
                <p-rating
                  formControlName="quality_rating"

                  [stars]="5">
                </p-rating>
                <small
                  class="p-error"
                  *ngIf="reviewForm.get('quality_rating')?.invalid && reviewForm.get('quality_rating')?.touched">
                  Quality rating is required
                </small>
              </div>

              <div class="col-12 md:col-6 field">
                <label class="block font-bold mb-2">Timeliness *</label>
                <p-rating
                  formControlName="timeliness_rating"

                  [stars]="5">
                </p-rating>
                <small
                  class="p-error"
                  *ngIf="reviewForm.get('timeliness_rating')?.invalid && reviewForm.get('timeliness_rating')?.touched">
                  Timeliness rating is required
                </small>
              </div>

              <div class="col-12 md:col-6 field">
                <label class="block font-bold mb-2">Professionalism *</label>
                <p-rating
                  formControlName="professionalism_rating"

                  [stars]="5">
                </p-rating>
                <small
                  class="p-error"
                  *ngIf="reviewForm.get('professionalism_rating')?.invalid && reviewForm.get('professionalism_rating')?.touched">
                  Professionalism rating is required
                </small>
              </div>
            </div>

            <!-- Recommendation -->
            <div class="field">
              <div class="flex align-items-center gap-2">
                <p-checkbox
                  formControlName="would_recommend"
                  [binary]="true"
                  inputId="would_recommend">
                </p-checkbox>
                <label for="would_recommend" class="font-bold">Would you recommend this person?</label>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              pButton
              type="submit"
              label="Submit Review"
              [loading]="loading"
              [disabled]="reviewForm.invalid || loading">
            </button>
          </form>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-rating .p-rating-item.p-rating-item-active .p-rating-icon {
        color: var(--yellow-500);
      }
      .p-inputtextarea.ng-invalid.ng-touched {
        border-color: var(--red-500);
      }
    }
  `]
})
export class ReviewFormComponent implements OnInit {
  reviewForm!: FormGroup;
  loading = false;
  contractId?: number;
  existingReview?: Review;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private messageService: MessageService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.contractId = Number(this.route.snapshot.params['contractId']);
    if (!this.contractId) {
      this.router.navigate(['/dashboard/reviews']);
      return;
    }

    this.checkCanReview();
  }

  initForm() {
    this.reviewForm = this.fb.group({
      rating: [null, Validators.required],
      review_text: ['', [Validators.required, Validators.minLength(20)]],
      communication_rating: [null, Validators.required],
      quality_rating: [null, Validators.required],
      timeliness_rating: [null, Validators.required],
      professionalism_rating: [null, Validators.required],
      would_recommend: [true]
    });
  }

  checkCanReview() {
    if (!this.contractId) return;

    this.reviewService.canReview(this.contractId).subscribe({
      next: (response) => {
        if (!response.can_review) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'You cannot review this contract at this time'
          });
          this.router.navigate(['/dashboard/reviews']);
        }
      },
      error: (error) => {
        console.error('Error checking review permission:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to check review permission'
        });
        this.router.navigate(['/dashboard/reviews']);
      }
    });
  }

  onSubmit() {
    if (this.reviewForm.valid && this.contractId) {
      this.loading = true;

      const reviewData = {
        ...this.reviewForm.value,
        contract: this.contractId
      };

      this.reviewService.createReview(reviewData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Review submitted successfully'
          });
          this.router.navigate(['/dashboard/reviews']);
        },
        error: (error) => {
          console.error('Error submitting review:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit review'
          });
          this.loading = false;
        }
      });
    } else {
      Object.keys(this.reviewForm.controls).forEach(key => {
        const control = this.reviewForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
