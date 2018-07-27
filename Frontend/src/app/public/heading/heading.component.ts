import { HeadingTabAuthService, LoginDetails } from './../../shared/headingtabauth.service';
import { Router } from '@angular/router';
import { AuthenticationService} from './../../authentication-service/authentication.service';
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css']
})
export class HeadingComponent implements OnInit {
  @Input () isWindowClosed: string;
  isloggedIn: LoginDetails;

  constructor(private auth: AuthenticationService,
    private router: Router,
  private headingtabauthservice: HeadingTabAuthService) {}

  ngOnInit() {
    this.headingtabauthservice.getLoginDetails().subscribe((data: LoginDetails ) => {
      this.isloggedIn = data;
    });
  }

  logout() {
    this.headingtabauthservice.resetLoginDetail().subscribe((data: LoginDetails) => {
      this.isloggedIn = data;
      this.router.navigate(['./aboutus']);
    });
  }

}
