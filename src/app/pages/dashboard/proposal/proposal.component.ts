import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalFormComponent } from './form/proposal-form.component';
import { ProposalTableComponent } from './proposal-table/proposal-table.component';

@Component({
  selector: 'app-proposal',
  standalone: true,
  imports: [CommonModule, ProposalFormComponent, ProposalTableComponent],
  templateUrl: './proposal.component.html'
})
export class ProposalComponent {
  refreshKey = 0;
  editingProposal: any = null;

  reload() {
    this.refreshKey++;
    this.editingProposal = null;
  }

  setEdit(proposal: any) {
    this.editingProposal = proposal;
  }
}
