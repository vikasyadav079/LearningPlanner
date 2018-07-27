import { AlertMessageComponent } from './alert-message.component';
import { Injectable } from '@angular/core';


@Injectable()
export class AlertMessageService {

  constructor(private alertMessageComponent: AlertMessageComponent) { }

  public showMessage( message: string) {
    this.alertMessageComponent.changeSuccessMessage(message);
  }

}
