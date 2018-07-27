import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';

@Injectable()
export class ServerErrorsInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler):     Observable<HttpEvent<any>> {
    // If the call fails, retry until 5 times before throwing an error
    return next.handle(request).retry(5);
  }

}
