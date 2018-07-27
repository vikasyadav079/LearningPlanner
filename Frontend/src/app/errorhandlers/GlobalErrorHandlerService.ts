import { HttpErrorResponse } from '@angular/common/http';
import { ErrorViewMangeService, ErrorSchema } from './error-view-mange.service';
import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorsServiceService } from './errors-service.service';
import * as StackTrace from 'stacktrace-js';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  errorObj: ErrorSchema;
  errorObjP: Promise<ErrorSchema>;

    constructor(private injector: Injector,
      private errorViewMangeService: ErrorViewMangeService
    ) {
      this.errorObj = new ErrorSchema();
    }

    handleError(error: any) {
      const router = this.injector.get(Router);

      const errorsService = this.injector.get(ErrorsServiceService);
        // get the stack trace, lets grab the last 10 stacks only
        if ( ! (error instanceof HttpErrorResponse)) {
          errorsService.log(error).subscribe();
          let st = 'Default stack trace';
          StackTrace.fromError(error).then(stackframes => {
          const stackString = stackframes
            .splice(0, 20)
            .map(function(sf) {
              return sf.toString();
            }).join('\n');
            st = stackString;
          });

        this.errorObj.message = error.message;
        this.errorObj.stackTrace = st;
        this.errorViewMangeService.updateErrorO(this.errorObj);
        router.navigate(['/error']);
        } else {
          this.errorObj.message = 'lmdmsdlm;dlsmldsmds;ldsm';
          this.errorObj.stackTrace = 'No stack trace for this exception';
          this.errorViewMangeService.updateErrorO(this.errorObj);
          // this.errorObjP = new Promise(resolve => resolve(this.errorObj));
          router.navigate(['/errorPage']);
        }
   }
}
