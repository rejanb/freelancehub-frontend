import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true
    }
  ]
})
export class StarRatingComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() rating: number = 0;
  @Input() value: number = 0;
  @Input() maxRating: number = 5;
  @Input() readonly: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showValue: boolean = true;
  @Input() showCount: boolean = false;
  @Input() count: number = 0;

  @Output() ratingChange = new EventEmitter<number>();

  private onChange = (value: number) => {};
  private onTouched = () => {};

  stars: number[] = [];
  hoveredRating: number = 0;

  ngOnInit() {
    this.stars = Array(this.maxRating).fill(0).map((_, i) => i + 1);
    // Use value if provided, otherwise use rating
    if (this.value) {
      this.rating = this.value;
    }
  }

  ngOnChanges() {
    // Update rating when value input changes
    if (this.value !== undefined && this.value !== this.rating) {
      this.rating = this.value;
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    this.rating = value || 0;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.readonly = isDisabled;
  }

  // Rating interaction
  onStarClick(starValue: number): void {
    if (this.readonly) return;
    
    this.rating = starValue;
    this.onChange(this.rating);
    this.ratingChange.emit(this.rating);
    this.onTouched();
  }

  onStarHover(starValue: number): void {
    if (this.readonly) return;
    this.hoveredRating = starValue;
  }

  onMouseLeave(): void {
    if (this.readonly) return;
    this.hoveredRating = 0;
  }

  // Helper methods
  getStarClass(starValue: number): string {
    const currentRating = this.hoveredRating || this.rating;
    const baseClass = `star ${this.size}`;
    
    if (starValue <= currentRating) {
      return `${baseClass} filled`;
    } else if (starValue - 0.5 <= currentRating) {
      return `${baseClass} half-filled`;
    } else {
      return `${baseClass} empty`;
    }
  }

  formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  formatCount(count: number): string {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  }
}
