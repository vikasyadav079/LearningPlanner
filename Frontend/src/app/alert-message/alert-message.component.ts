import { Subject } from 'rxjs/Subject';
import { Component, OnInit } from '@angular/core';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.css']
})
export class AlertMessageComponent implements OnInit {

  private _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage: string;

  ngOnInit(): void {
    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }

  public changeSuccessMessage(message: string) {
    this._success.next('sabjdkjadkskjsd');
  }

}
