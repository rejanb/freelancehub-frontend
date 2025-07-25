import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';

import { RatingService } from '../../service/rating.service';
import { AuthService } from '../../service/auth.service';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { RatingModalComponent } from '../../shared/components/rating-modal/rating-modal.component';
import { Rating, RatingSummary, PendingRating } from '../../model/rating.models';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TabViewModule,
    CardModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    SkeletonModule,
    PaginatorModule,
    StarRatingComponent,
    RatingModalComponent
  ],
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent implements OnInit {
  // Data properties
  receivedRatings: Rating[] = [];
  givenRatings: Rating[] = [];
  pendingRatings: PendingRating[] = [];
  ratingSummary: RatingSummary | null = null;

  // UI state
  loading = true;
  currentTab = 0;
  showRatingModal = false;
  selectedPendingRating: PendingRating | null = null;

  // Pagination
  receivedPage = 0;
  givenPage = 0;
  pageSize = 10;
  totalReceivedRatings = 0;
  totalGivenRatings = 0;

  constructor(
    private ratingService: RatingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      this.loading = true;
      
      // Load all data in parallel
      const [summary, received, given, pending] = await Promise.all([
        this.ratingService.getRatingSummary().toPromise(),
        this.ratingService.getReceivedRatings(this.receivedPage, this.pageSize).toPromise(),
        this.ratingService.getGivenRatings(this.givenPage, this.pageSize).toPromise(),
        this.ratingService.getPendingRatings().toPromise()
      ]);

      this.ratingSummary = summary || null;
      this.receivedRatings = received?.results || [];
      this.totalReceivedRatings = received?.count || 0;
      this.givenRatings = given?.results || [];
      this.totalGivenRatings = given?.count || 0;
      this.pendingRatings = pending || [];

    } catch (error) {
      console.error('Error loading ratings data:', error);
    } finally {
      this.loading = false;
    }
  }

  async onReceivedPageChange(event: any) {
    this.receivedPage = event.page;
    try {
      const response = await this.ratingService.getReceivedRatings(this.receivedPage, this.pageSize).toPromise();
      this.receivedRatings = response?.results || [];
      this.totalReceivedRatings = response?.count || 0;
    } catch (error) {
      console.error('Error loading received ratings:', error);
    }
  }

  async onGivenPageChange(event: any) {
    this.givenPage = event.page;
    try {
      const response = await this.ratingService.getGivenRatings(this.givenPage, this.pageSize).toPromise();
      this.givenRatings = response?.results || [];
      this.totalGivenRatings = response?.count || 0;
    } catch (error) {
      console.error('Error loading given ratings:', error);
    }
  }

  openRatingModal(pendingRating: PendingRating) {
    this.selectedPendingRating = pendingRating;
    this.showRatingModal = true;
  }

  onRatingSubmitted() {
    this.showRatingModal = false;
    this.selectedPendingRating = null;
    // Refresh data
    this.loadData();
  }

  onRatingCancelled() {
    this.showRatingModal = false;
    this.selectedPendingRating = null;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getProjectStatusSeverity(status: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  }

  getAvatarLabel(name: string): string {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  }
}
