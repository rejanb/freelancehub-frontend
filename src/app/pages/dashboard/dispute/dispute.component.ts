import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisputeFormComponent } from './form/dispute-form.component';
import { DisputeTableComponent } from './dispute-table/dispute-table.component';

@Component({
  selector: 'app-dispute',
  standalone: true,
  imports: [CommonModule, DisputeFormComponent, DisputeTableComponent],
  template: `
    <app-dispute-form [disputeToEdit]="editingDispute" (submitted)="reload()" />
    <app-dispute-table [refreshKey]="refreshKey" (edit)="setEdit($event)" />
  `
})
export class DisputeComponent {
  refreshKey = 0;
  editingDispute: any = null;

  reload() {
    this.refreshKey++;
    this.editingDispute = null;
  }

  setEdit(dispute: any) {
    this.editingDispute = dispute;
  }
}
