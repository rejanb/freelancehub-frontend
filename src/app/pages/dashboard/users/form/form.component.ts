import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../service/user.service';

@Component({
    selector: 'app-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
    @Input() user: any = null; // For edit
    @Output() saved = new EventEmitter<void>();

    userForm!: FormGroup;

    constructor(private fb: FormBuilder, private userService: UserService) { }

    ngOnInit() {
        this.userForm = this.fb.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            user_type: ['', Validators.required],
            bio: [''],
            skills: ['']
        });
        if (this.user) {
            this.userForm.patchValue(this.user);
        }
    }

    onSubmit() {
        if (this.userForm.invalid) return;
        if (this.user && this.user.id) {
            this.userService.updateUser(this.user.id, this.userForm.value).subscribe(() => this.saved.emit());
        } else {
            this.userService.createUser(this.userForm.value).subscribe(() => this.saved.emit());
        }
    }
}
