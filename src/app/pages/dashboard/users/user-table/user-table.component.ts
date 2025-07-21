import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent {
  @Input() users: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();

  onEdit(user: any) {
    this.edit.emit(user);
  }

  onDelete(user: any) {
    this.delete.emit(user.id);
  }
}
