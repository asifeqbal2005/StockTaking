import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {
  h1Message: string;
  h2Message: string;
  enableBackToHome = false;

  constructor(private securityService: SecurityService,) { }

  ngOnInit(): void {
    this.h1Message = "403";
    this.h2Message = "Access Denied";
    this.enableBackToHome = this.securityService.getUserData() == null ? false : true;
  }

  

}
