import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable()
export class LoaderService {
  isLoading = new Subject<boolean>();
  exclusiveRun = false;
  show() {
    this.isLoading.next(true);
  }
  hide() {
    if (!this.exclusiveRun) {
      this.isLoading.next(false);
    }
  }
}
