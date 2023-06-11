import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../shared/services/security.service';
import { LoaderService } from '../../shared/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.css']
})
export class LogOutComponent implements OnInit {

  constructor(private securityService: SecurityService,
    private activeRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private router: Router) { }

  ngOnInit(): void {
   //this.securityService.logout();
  }
  onLogOffClick() {
    this.securityService.login();
    this.loaderService.exclusiveRun = true;
     this.loaderService.show();
    this.router.navigate(['/']);

  }
}
