import { Component, Inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MultilingualPipe } from "src/app/shared/pipes/multilingual.pipe";
//import { TranslatorService } from "src/app/shared/services/translator.service";
import { Subscription } from 'rxjs';
import { BaseComponentComponent } from '../../../components/base-component/base-component.component';
import { SecurityService } from '../../../shared/services/security.service';
import { NotificationService } from '../../../shared/services/notification.service';
@Component({
  selector: 'confirmation-popup',
  templateUrl: 'confirmation-popup.html',
  styleUrls: ['confirmation-popup.css']
})
export class ConfirmationPopup extends BaseComponentComponent implements OnInit {
  languageSubscription: Subscription;
  pageLayout = [];
  primaryId: number;
  title: string;
  subTitle: string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmationPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private cd: ChangeDetectorRef,
    private notificationService: NotificationService,
    private multilingualPipe: MultilingualPipe,
    //private translatorService: TranslatorService,
    securityService: SecurityService,
  ) {
    super(securityService, null);

    this.getPageLayout();
    this.primaryId = data.primaryId;
    this.title = data.title;
    this.subTitle = data.subTitle;
  }

  ngOnInit(): void {
    this.getPageLayout();
  }

  async getPageLayout() {
    const self = this;
    self.cd.markForCheck();
  }  

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick() {
    this.dialogRef.close(this.primaryId);
  }
  
}
