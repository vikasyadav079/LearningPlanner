import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './../authentication-service/authentication.service';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

export class LoginDetails {
    islogin: Boolean;
    role: String;
}

@Injectable()
export class HeadingTabAuthService {
    loginDetails;
    currentLoginDetails: BehaviorSubject<LoginDetails>;
    myLoginDetails: Observable<LoginDetails>;

    constructor(private auth: AuthenticationService) {
        if (!localStorage.getItem('logindetails')) {
            this.loginDetails = {islogin: false, role: ''};
        } else {
            this.loginDetails = JSON.parse(localStorage.getItem('logindetails'));
        }
        this.currentLoginDetails = new BehaviorSubject<LoginDetails>(this.loginDetails);
        this.myLoginDetails = this.currentLoginDetails.asObservable();
    }

    setLoginDetails (logindetails: LoginDetails) {
        localStorage.setItem('logindetails' , JSON.stringify(logindetails));
        this.currentLoginDetails.next(logindetails);
    }

    getLoginDetails() {return this.myLoginDetails; }

    resetLoginDetail() {
        this.auth.logout();
        this.currentLoginDetails.next({islogin: false, role: ''});
        return this.myLoginDetails;
    }




}
