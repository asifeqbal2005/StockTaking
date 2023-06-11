import { Component, OnInit } from '@angular/core';
import { enumAccessOnPage } from '../../shared/models/common.enum';
//import { MultilingualService } from '../../shared/services/multilingual.service';
import { SecurityService } from '../../shared/services/security.service';
import { BaseComponentComponent } from '../base-component/base-component.component';
//import { TranslatorService } from "../../shared/services/translator.service";
import { Subscription } from 'rxjs/internal/Subscription';
import { NotificationService } from '../../shared/services/notification.service';
import { MultilingualPipe } from '../../shared/pipes/multilingual.pipe';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: ['.active { background-color: #eef; } table {    width: 100%;  }']

})
export class HomeComponent extends BaseComponentComponent implements OnInit {
  eventDisplayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  eventDataSource: Array<any> = [];

  actionDisplayedColumns: string[] = ['position', 'name'];
  actionDataSource: Array<any> = [];

  meetingDisplayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  meetingDataSource: Array<any> = [];

  nutritionClubDisplayedColumns: string[] = ['position', 'name'];
  nutritionClubDataSource: Array<any> = [];

  dashboardData: any = {

  };
  pageLayout = [];

  languageSubscription: Subscription;

  constructor(
    //private mulService: MultilingualService,
    public securityService: SecurityService,
    //private translatorService: TranslatorService,
    //private notificationService: NotificationService,
    public multilingualPipe: MultilingualPipe,
  ) {
    super(securityService, enumAccessOnPage.Home);
    
    // this.languageSubscription = this.translatorService.getLanguageChangeEvent().subscribe(message => {
    //   this.getPageLayout();
    // });
  }

  // async getPageLayout() {
  //   const self = this;
  //   let selectedLanguage = { EntityNameFilter: "Home", languageIdFilter: parseInt(self.languageSelectedValue) };
  //   this.mulService.getAllMultilingualItem(selectedLanguage).subscribe((data: any) => {
  //     self.pageLayout = data;
  //   });
  // }

  get userName() {
    return this.securityService.getUserData().userName;
  }

  ngOnInit(): void {
    //this.bindEvent();
    //this.getPageLayout();
    //this.bindEvent();
  }

  // bindEvent() {
  //   this.mulService.GetDashboardData().subscribe((response: any) => {
  //     this.dashboardData = response.data;
  //     this.eventDataSource = response.data.events;
  //     this.actionDataSource = response.data.plans;
  //     this.meetingDataSource = response.data.meetings;
  //     this.nutritionClubDataSource = response.data.Clubs;
  //     this.getPageLayout();
  //   });
  // }

}
