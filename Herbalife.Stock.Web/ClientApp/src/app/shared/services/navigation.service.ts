import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class NavigationService {

  private subject = new Subject<any>();
  isValidInput$: Observable<any>;

  //confirmNavigation(yesFunction: () => void, noFunction: () => void): any {
  //  return this.setNavigationConfirmation(yesFunction, noFunction);
  //}

  setNavigationConfirmation(yesFunction, noFunction): any {
    var def = $.Deferred();
    const that = this;
    this.subject.next({
      type: 'confirm',
      //text: message,
      yesFunction(): any {
        that.subject.next(); // This will close the modal  
        yesFunction();
        def.resolve(false);
      },
      noFunction(): any {
        that.subject.next();
        noFunction();
        def.resolve(true);
      }
    })

    return def.promise();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
