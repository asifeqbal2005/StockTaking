"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsavedChangesGuard = void 0;
var core_1 = require("@angular/core");
var UnsavedChangesGuard = /** @class */ (function () {
    function UnsavedChangesGuard(storageService, claimsService, navigationService, notificationService) {
        this.storageService = storageService;
        this.claimsService = claimsService;
        this.navigationService = navigationService;
        this.notificationService = notificationService;
    }
    UnsavedChangesGuard.prototype.canDeactivate = function (component, callbackFunction) {
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
                    if (component.saveMethod != undefined) {
                        component.saveMethod();
                    }
                }, function () {
                }).then(function (res) {
                    if (res) {
                        return res;
                    }
                    else {
                        var saveChangesPromise = new Promise(function (resolve, reject) {
                            component.isValidInput$.subscribe(function (x) {
                                return resolve(component.isFormSubmitted);
                            });
                        });
                        return saveChangesPromise;
                    }
                });
            }
        }
    };
    UnsavedChangesGuard = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], UnsavedChangesGuard);
    return UnsavedChangesGuard;
}());
exports.UnsavedChangesGuard = UnsavedChangesGuard;
//# sourceMappingURL=unsaved-changes.guard.js.map