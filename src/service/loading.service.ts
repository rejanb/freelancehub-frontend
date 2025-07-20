import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  show() {
       console.log('LoadingService: show');
    this.loadingSubject.next(true);
  }

  hide() {
        console.log('LoadingService: hide');
    this.loadingSubject.next(false);
  }
}
