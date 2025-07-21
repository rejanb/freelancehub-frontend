import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisputeService } from '@/app/service/dispute.service';

@Component({
  selector: 'app-dispute-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dispute-table.component.html'
})
export class DisputeTableComponent implements OnChanges {
  @Input() refreshKey = 0;
  @Output() edit = new EventEmitter<any>();

  disputes: any[] = [];

  constructor(private disputeService: DisputeService) {}

  ngOnChanges(): void {
    this.disputeService.getAll().subscribe(data => {
      this.disputes = data;
    });
  }

  deleteDispute(id: string) {
    if (confirm('Are you sure you want to delete this dispute?')) {
      this.disputeService.deleteDispute(id).subscribe(() => this.ngOnChanges());
    }
  }
}
