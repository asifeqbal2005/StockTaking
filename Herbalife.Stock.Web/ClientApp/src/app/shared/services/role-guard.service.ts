import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { SecurityService } from './security.service';
import * as decode from 'jwt-decode';

@Injectable({
  providedIn: "root"
})
export class RoleGuardService implements CanActivate {
  
  constructor(public securityService: SecurityService, public router: Router) { }
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    
    let isAccessible: boolean = false;
    let expectedPagePermission = route.data;
    let pagePermissionId = expectedPagePermission.userPermissionsId;
    let permittedAction = expectedPagePermission.permission;

    isAccessible = this.securityService.getAccessOnPage(pagePermissionId.toString());

    if (this.securityService.IsAuthorized && isAccessible) {
      console.log("User permitted to access the route");
      return true;
    }
    else {
      this.router.navigate(['access-denied']);
      return false;
    }    
  }
}
