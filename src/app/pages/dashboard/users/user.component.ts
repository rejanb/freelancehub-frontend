import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@/app/service/user.service';
import { UserTableComponent } from './user-table/user-table.component';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    UserTableComponent,
    FormComponent
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;
  users: any[] = [];
  editingUserId: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });

    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Failed to load users', err)
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;
    if (this.editingUserId) {
      this.userService.updateUser(this.editingUserId, userData).subscribe({
        next: () => {
          this.loadUsers();
          this.resetForm();
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.loadUsers();
          this.resetForm();
        },
        error: (err) => console.error('Create failed', err)
      });
    }
  }

  editUser(user: any) {
    this.userForm.patchValue(user);
    this.editingUserId = user.id;
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  resetForm() {
    this.userForm.reset();
    this.editingUserId = null;
  }
}
