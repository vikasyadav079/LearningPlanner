import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './authentication.service';



@Injectable()
export class AuthGuardService implements CanActivate {

  private isLoggedInO = false;
  constructor(private auth: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  canActivate(): boolean {
    this.isLoggedInO = this.auth.isLoggedInAsBool();
    if (! this.isLoggedInO) {
      this.router.navigate(['/aboutus']);
      return false;
    }
    return true;
  }
}

