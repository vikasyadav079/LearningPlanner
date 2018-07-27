import { RegisterValidator } from './register-validator';
import { AuthenticationService, UserDetails, TokenResponse } from './../authentication-service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup,  Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HeadingTabAuthService } from './../shared/headingtabauth.service';

class CAlert {
  type: string;
  message: string;
}

interface RegisterSchemaI {
  username: String;
  password: String;
  email: String;
  role: String;
  isActive: Boolean;
}

class RegisterSchemaC implements RegisterSchemaI {
  username: String;
  password: String;
  email: String;
  role: String;
  isActive: Boolean;
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationFormGroup: FormGroup;
  passwordFormGroup: FormGroup;

  credentials: RegisterSchemaC;
  showAlert: Boolean;
  alertType: CAlert;

  constructor(private auth: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private headingtabauthserviceO: HeadingTabAuthService) {
    this.credentials = new RegisterSchemaC ();
    this.showAlert = false;
    this.alertType = new CAlert();
   }

  ngOnInit() {
    this.showAlert = false;
    this.alertType = new CAlert();
    this.passwordFormGroup = this.formBuilder.group({
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required]
    }, {
      validator: RegisterValidator.validate.bind(this)
    });
    this.registrationFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      useremail: ['', Validators.required],
      passwordFormGroup: this.passwordFormGroup
    });
  }

  register(registeredDetails) {
    this.credentials.username = registeredDetails.username;
    this.credentials.email = registeredDetails.useremail;
    this.credentials.password = registeredDetails.passwordFormGroup.password;
    this.credentials.role = 'User';
    this.credentials.isActive = true;
    this.auth.register (this.credentials).subscribe((data: TokenResponse) => {
      this.auth.saveToken(data.token);
      this.headingtabauthserviceO.setLoginDetails({islogin: true, role: 'User'});
      this.router.navigateByUrl('/home');
    },
    (err) => {
      console.error(err);
      if (err.status === 401 || err.status === 404) {
        this.showAlert = true;
        this.alertType.type = 'danger';
        this.alertType.message = 'Registration Failure. User already registered';
      } else {
        this.showAlert = true;
        this.alertType.type = 'danger';
        this.alertType.message = 'Internal Server Error';
        throw err;
      }
    });
  }

  closeAlert() {
    this.showAlert = false;
  }

}
