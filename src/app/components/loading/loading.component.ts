import {Component, Input} from '@angular/core';
import {AsyncPipe, CommonModule, NgIf} from "@angular/common";
import {ProgressSpinner} from "primeng/progressspinner";

@Component({
  selector: 'app-loading',
  standalone: true,
    imports: [
        AsyncPipe,
        NgIf,
        ProgressSpinner,
      CommonModule
    ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  @Input() show : any = false;
}
