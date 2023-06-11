"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseComponentComponent = void 0;
var core_1 = require("@angular/core");
var common_enum_1 = require("../../shared/models/common.enum");
var BaseComponentComponent = /** @class */ (function () {
    function BaseComponentComponent(securityService, UserPermissionID) {
        var _this = this;
        this.securityService = securityService;
        this.isReadOnlyMode = false;
        this.isEditMode = false;
        this.isAddMode = false;
        this.isDeleteMode = false;
        var userDetails = this.securityService.getUserData().userRolePermissionModels;
        var data = userDetails.filter(function (c) { return c.userPermissionsId == UserPermissionID && c.superUser == _this.securityService.getUserData().superUser; });
        for (var k = 0; k < data.length; k++) {
            this.permissionId = data[k].permission;
            if (this.permissionId == common_enum_1.enumPermissions.Read) {
                this.isReadOnlyMode = true;
            }
            else if (this.permissionId == common_enum_1.enumPermissions.Edit) {
                this.isEditMode = true;
            }
            else if (this.permissionId == common_enum_1.enumPermissions.Add) {
                this.isAddMode = true;
            }
            else if (this.permissionId == common_enum_1.enumPermissions.Delete) {
                this.isDeleteMode = true;
            }
        }
        if (this.isReadOnlyMode == true && (this.isAddMode == true || this.isEditMode == true)) {
            this.isReadOnlyMode = false;
        }
    }
    BaseComponentComponent.prototype.ngOnInit = function () {
    };
    BaseComponentComponent = __decorate([
        core_1.Component({
            selector: 'app-base-component',
            templateUrl: './base-component.component.html',
            styleUrls: ['./base-component.component.css']
        })
    ], BaseComponentComponent);
    return BaseComponentComponent;
}());
exports.BaseComponentComponent = BaseComponentComponent;
//# sourceMappingURL=base-component.component.js.map