import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextarea } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { StarRatingComponent } from '../star-rating/star-rating.component';
import { RatingService } from '../../../service/rating.service';
import { RatingRequest } from '../../../model/rating.models';

@Component({
  selector: 'app-rating-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextarea,
    ToastModule,
    StarRatingComponent
  ],
  providers: [MessageService],
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.scss']
})
export class RatingModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() projectId: number = 0;
  @Input() projectTitle: string = '';
  @Input() freelancerId: number = 0;
  @Input() freelancerName: string = '';
  @Input() ratingType: 'freelancer' | 'client' = 'freelancer';
  @Input() clientName: string = '';

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() ratingSubmitted = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  ratingForm!: FormGroup;
  submitting = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private ratingService: RatingService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.ratingForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.maxLength(500)]]
    });
  }

  onDialogHide() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  getModalTitle(): string {
    return `Rate ${this.ratingType === 'freelancer' ? this.freelancerName || 'Freelancer' : this.clientName || 'Client'}`;
  }

  onSubmit() {
    if (this.ratingForm.valid && !this.submitting) {
      this.submitRating();
    }
  }

  onCancel() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancelled.emit();
  }

  resetForm() {
    this.ratingForm.reset();
    this.ratingForm.patchValue({ rating: 0, comment: '' });
  }

  onRatingChange(rating: number) {
    this.ratingForm.patchValue({ rating });
  }

  submitRating() {
    if (this.ratingForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    const formValue = this.ratingForm.value;

    const ratingData: RatingRequest = {
      project_id: this.projectId,
      freelancer_id: this.freelancerId,
      rating: formValue.rating,
      review: formValue.review,
      communication_rating: formValue.communicationRating,
      quality_rating: formValue.qualityRating,
      timeliness_rating: formValue.timelinessRating,
      payment_rating: formValue.paymentRating,
      clarity_rating: formValue.clarityRating,
      would_recommend: formValue.wouldRecommend
    };

    this.ratingService.submitRating(ratingData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Rating Submitted',
          detail: 'Thank you for your feedback!'
        });
        
        this.ratingSubmitted.emit(response);
        this.onDialogHide();
        this.submitting = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to submit rating. Please try again.'
        });
        this.submitting = false;
      }
    });
  }

  submitDetailedReview() {
    // Close modal and navigate to detailed review page
    this.onDialogHide();
    // You can emit an event or navigate to detailed review page
    // For now, we'll just show a message
    this.messageService.add({
      severity: 'info',
      summary: 'Redirecting',
      detail: 'Redirecting to detailed review page...'
    });
  }

  skipForNow() {
    this.onDialogHide();
    this.messageService.add({
      severity: 'info',
      summary: 'Skipped',
      detail: 'You can rate this project later from your dashboard.'
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.ratingForm.controls).forEach(key => {
      const control = this.ratingForm.get(key);
      control?.markAsTouched();
    });
  }

  get ratingControl() {
    return this.ratingForm.get('rating');
  }

  get commentControl() {
    return this.ratingForm.get('comment');
  }

  getRatingText(rating: number): string {
    const ratings = [
      '',
      'Poor',
      'Fair', 
      'Good',
      'Very Good',
      'Excellent'
    ];
    return ratings[rating] || '';
  }
}
