import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '@/app/service/proposal.service';

@Component({
  selector: 'app-proposal-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proposal-table.component.html'
})
export class ProposalTableComponent implements OnChanges {
  @Input() refreshKey: number = 0;
  @Output() edit = new EventEmitter<any>();

  proposals: any[] = [];

  constructor(private proposalService: ProposalService) {}

  ngOnChanges(): void {
    this.proposalService.getAll().subscribe(data => {
      this.proposals = data;
    });
  }

  deleteProposal(id: string) {
    if (confirm('Are you sure you want to delete this proposal?')) {
      this.proposalService.deleteProposal(id).subscribe(() => this.ngOnChanges());
    }
  }
}
