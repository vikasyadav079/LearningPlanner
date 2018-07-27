import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

export class ErrorSchema {
  message: String;
  stackTrace: String;
}

@Injectable()
export class ErrorViewMangeService {

  errorObj = new BehaviorSubject<ErrorSchema> ({message: 'No Error ', stackTrace: 'No Stack Trace'});
  errorObjO = this.errorObj.asObservable();

  constructor() { }

  updateErrorO (newErrorObj: ErrorSchema) {
    this.errorObj.next(newErrorObj);
  }

  returnErrorObjO () {
    return this.errorObjO;
  }

}
