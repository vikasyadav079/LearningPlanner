import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

export interface UserDetails {
  _id: String;
  fullname: String;
  email: String;
  username: String;
  role: String;
  isActive: Boolean;
  exp: number;
  iat: number;
}

interface NextComponentI {
  isLogin: boolean ;
  role: string;
}

export interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  username: String;
  password: String;
}

export class NextComponentC implements NextComponentI {
  isLogin: boolean;
  role: string;
}

export class BaseUrl {
  static baseUri = 'http://vikasy02:3000/api';
}

@Injectable()
export class AuthenticationService {
  private token: String;
  isLoggedInO = new BehaviorSubject<NextComponentC> ({isLogin: false, role: ''});
  nextPageO: NextComponentC ;


  constructor(private http: HttpClient, private router: Router) { }

  public saveToken (token: string) {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): String {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;

  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      localStorage.setItem('user-details', payload);
      return JSON.parse(payload);
    } else {
      return null;
    }

  }

  // Check whether user is logged in
  public isLoggedIn(): Observable<NextComponentC> {
    const user: UserDetails = this.getUserDetails();
    this.nextPageO = new NextComponentC();
    if (user) {
      this.nextPageO['role'] =  ( user.role as string) ;
      this.nextPageO['isLogin'] = (user.exp > Date.now() / 1000);
      this.isLoggedInO.next(this.nextPageO);

    } else {
      this.nextPageO['isLogin'] = false;
      this.nextPageO['role'] = '';
      this.isLoggedInO.next(this.nextPageO);

    }
    return this.isLoggedInO.asObservable();
  }

  public isLoggedInAsBool(): boolean {
    const user: UserDetails = this.getUserDetails();
    if (user) {
      return (user.exp > Date.now() / 1000);
    }
    return false;
  }

  private request (method: 'post'| 'get' , type: 'login'| 'register', user?: TokenPayload): Observable<any> {
    let base;
    if (method === 'post') {
      base =  this.http.post(BaseUrl.baseUri + '/' + `${type}`, user);
    }

    const result = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token as string);
        }
        return data;
      })
    );
    return result;
  }


  public register (user: TokenPayload): Observable<any> {
    return this.request('post', 'register', user);
  }

  public login (user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }

}
