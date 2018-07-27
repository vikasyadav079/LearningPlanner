import { LoaderService } from './../loader/loader.service';
import { HeadingTabAuthService } from './../shared/headingtabauth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService, TokenPayload, TokenResponse, UserDetails  } from '../authentication-service/authentication.service';
import { Router } from '@angular/router';

class CAlert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormControl: FormGroup;
  Username: FormControl;
  Password: FormControl;
  UserDetailsO: TokenPayload;
  UsernameValue: String;
  PasswordValue: String;
  loginUserDetails: UserDetails;
  showAlert: Boolean;
  alertType: CAlert;


  constructor(private auth: AuthenticationService,
    private router: Router,
    private headingtabauthserviceO: HeadingTabAuthService,
    private loaderService: LoaderService) {
    this.showAlert = false;
    this.alertType = new CAlert();
   }

  ngOnInit() {
    this.showAlert = false;
    this.Username = new FormControl('', Validators.required);
    this.Password = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(4)
    ]));

    this.loginFormControl = new FormGroup({
      username: this.Username,
      password: this.Password
    });
  }

  formSubmit(currentFormValue, content) {
    this.UsernameValue = currentFormValue['username'];
    this.PasswordValue = currentFormValue['password'];

    this.loaderService.display(true);


    // Calling login API
    this.auth.login({username : this.UsernameValue, password : this.PasswordValue }).subscribe(
      (res: TokenResponse) => {
        this.loaderService.display(false);
        this.auth.saveToken(res.token);
        this.loginUserDetails = this.auth.getUserDetails();
        if ( (this.loginUserDetails.isActive) && this.loginUserDetails.role === 'User') {
          this.headingtabauthserviceO.setLoginDetails({islogin: true, role: 'User'});
          this.router.navigate(['/home']);
        }
        if ( (this.loginUserDetails.isActive) && this.loginUserDetails.role === 'SubAdmin') {
          this.headingtabauthserviceO.setLoginDetails({islogin: true, role: 'SubAdmin'});
          this.router.navigate(['/subAdminManagement']);
        }
        if ( this.loginUserDetails.isActive && this.loginUserDetails.role === 'Admin') {
          this.headingtabauthserviceO.setLoginDetails({islogin: true, role: 'Admin'});
          this.router.navigate(['/adminManagement']);
        }


      },
      (err: Response) => {
        this.loaderService.display(false);
        this.showAlert = true;
        if (err.status === 401 || err.status === 404) {
          this.alertType.type = 'danger';
          this.alertType.message = 'Authentication Failure';
        } else {
          this.alertType.type = 'danger';
          this.alertType.message = 'Internal Server Error';
          throw (err) ;
        }
      }
    );
  }

  closeAlert() {
    this.showAlert = false;
  }

}
