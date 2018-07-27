import { AuthenticationService } from './../authentication-service/authentication.service';
import { Injectable, Injector} from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/of';
// Cool library to deal with errors: https://www.stacktracejs.com
import * as StackTraceParser from 'error-stack-parser';


@Injectable()
export class ErrorsServiceService {

  constructor(
    private injector: Injector,
    private authenticationService: AuthenticationService,
    private httpClient: HttpClient
  ) {}
log(error) {
    // Log the error to the console
    console.log(error);
    // Send error to server
    const errorToSend = this.addContextInfo(error);
    return this.httpClient.post('http://localhost:3000/api/logError' , {ClientError: errorToSend});
}
addContextInfo(error) {
    // All the context details that you want (usually coming from other services; Constants, UserService...)
    const name = error.name || null;
    const appId = 'LearningPlanner';
    const user = this.authenticationService.getUserDetails().username;
    const time = new Date().getTime();
    const id = `${appId}-${user}-${time}`;
    const location = this.injector.get(LocationStrategy);
    const url = location instanceof PathLocationStrategy ? location.path() : '';
    const status = error.status || null;
    const message = error.message || error.toString();
    const stack = error instanceof HttpErrorResponse ? null : StackTraceParser.parse(error);
    const errorToSend = {name, appId, user, time, id, url, status, message, stack};
    return errorToSend;
  }

}
