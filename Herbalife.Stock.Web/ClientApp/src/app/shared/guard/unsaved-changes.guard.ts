import { Injectable } from '@angular/core';
import { CanDeactivate} from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { NavigationService } from '../services/navigation.service';
import { NotificationService } from '../services/notification.service';



export interface ComponentCanDeactivate {

  canDeactivate: () => boolean | Observable<boolean>;
  saveMethod: () => Promise<boolean>;
  isValidInput$: Observable<object>;
  formValidityFlagLoaded: Observable<object>;
  //isValid: boolean;
  isFormSubmitted: boolean;
  isFormDirty: () => boolean;
  isSettledButtonClicked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor(private storageService: StorageService,
    private navigationService: NavigationService,
    private notificationService: NotificationService) {
  }
  canDeactivate(component: ComponentCanDeactivate): Observable<boolean> | boolean {
    if (component.isFormDirty()) {
      return false;
    }
    else {
      if (component.canDeactivate()) {
        if (component.isSettledButtonClicked) {
          this.notificationService.printWarningMessage("Claim has not been settled yet. Please click the 'Settle' button again to settle the claim.");
        }
        return true;
      }
      else {
        if (component.isSettledButtonClicked) {
          this.notificationService.printWarningMessage("Claim has not been settled yet. Please click the 'Settle' button again to settle the claim.");
        }

        return this.navigationService.setNavigationConfirmation(function () {
          if (component.saveMethod !== undefined) {
            component.saveMethod();
          }
        },
          function () {
          }).then((res) => {
            if (res) {
              return res;
            }
            else {
              const saveChangesPromise = new Promise((resolve) => {
                component.isValidInput$.subscribe(() => {
                  return resolve(component.isFormSubmitted);
                });
              });
              return saveChangesPromise;
            }
          });
      }
    }
  }
 }
