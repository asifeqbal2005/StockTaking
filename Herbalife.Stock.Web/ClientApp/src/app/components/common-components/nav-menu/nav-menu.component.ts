import { Component, HostBinding, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from '../../../shared/services/security.service';
import { Subject } from 'rxjs';
import { enumAccessOnPage } from 'src/app/shared/models/common.enum';
//import { MultilingualService } from 'src/app/shared/services/multilingual.service';
import { NavMenuService } from './nav-menu.service';
//import { NotificationService } from '../../../shared/services/notification.service';
//import { MultilingualPipe } from "src/app/shared/pipes/multilingual.pipe";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isUserLoggedIn = false;
  isAdmin = false;
  isExpanded = false;
  userName = "";
  email = "";
  claimHandlerId: number;
  languageData: any[] = [];
  countryData: any[] = [];
  countryId = 0;
  languageId = 0;
  pageLayout = [];
  menuItem: any[] = [];
  subject = new Subject<any>();
  EnumAccessOnPage = enumAccessOnPage;
  menuData: any[] = [];
  subMenuData: any[] = [];
  collapse() {
    this.isExpanded = false;
  }
  navbarOpened = false;
  toggleNavbar() {
    document.getElementsByTagName("body")[0].classList.toggle("sidebar-minified");
  }
  public isCollapsed = false;

  constructor(
    private navMenuService: NavMenuService,
    private securityService: SecurityService,    
    private router: Router) {

  }  

  ngOnInit() {
    this.getParentChildMenu();
    this.userName = this.securityService.getUserData().userName;
    this.securityService.userDataLoaded$.subscribe(() => {
      this.isUserLoggedIn = true;

      if (this.securityService.getUserData().userName !== null && this.securityService.getUserData().userName !== '') {
        this.userName = this.securityService.getUserData().userName;
      }
      if (this.securityService.getUserData().email !== null && this.securityService.getUserData().email !== '') {
        this.email = this.securityService.getUserData().email;
      }

      this.isAdmin = this.securityService.getUserData().isAdmin;
      this.claimHandlerId = this.securityService.getUserData().userID;

    });    
  }  

  getParentChildMenu() {
    
    this.navMenuService.GetParentChildMenu().subscribe((data: any) => {
      this.menuData = data.data.filter(p => !p.isParent && p.childMenu.length == 0);
      this.subMenuData = data.data.filter(p => p.childMenu.length > 0);
      this.subMenuData = this.subMenuData.map(p => ({
        childMenu: p.childMenu.map(k => ({
          childMenu: k.childMenu,
          description: k.description,
          displayOrder: k.displayOrder,
          entityIcon: k.entityIcon,
          entityName: k.entityName,
          isParent: k.isParent,
          // labelId: k.labelId,
          // labelName: k.labelName,
          routerLink: k.routerLink,
          //translatedText: k.translatedText,
          parentEntityName: p.entityName
        })),
        description: p.description,
        displayOrder: p.displayOrder,
        entityIcon: p.entityIcon,
        entityName: p.entityName,
        isParent: p.isParent,
        //labelId: p.labelId,
        //labelName: p.labelName,
        routerLink: p.routerLink,
        //translatedText: p.translatedText,
      }));
    });
  }

  menuChange(req) {
    this.menuData.map(p => p.isSelected = false);
    if (!!this.subMenuData && this.subMenuData.length > 0) {
      this.subMenuData.map(p => p.isSelected = false);
      this.subMenuData.map(p => p.childMenu.map(k => k.isSelected = false));
    }
    req.isSelected = true;
  }

  subMenuChange(req, childreq, isChild = false) {
    this.menuData.map(p => p.isSelected = false);
    if (!isChild) {
      this.subMenuData.map(p => p.isSelected = false);
      req.isSelected = true;
    } else {
      this.subMenuData.map(p => p.childMenu.map(k => k.isSelected = false));
      childreq.isSelected = true;
      req.isSelected = true;
    }
  }  

  Logout() {
    this.securityService.logout();
    this.router.navigate(['/log-out']);
  }
}
