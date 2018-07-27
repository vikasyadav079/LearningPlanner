import { BaseUrl } from './../authentication-service/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

interface UserNameTemplateI {
  _id: String;
  username: String;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() name;

  userNames: Array<String>;
  constructor(public activeModal: NgbActiveModal, private httpClient: HttpClient) {
    this.userNames = new Array();
  }

  ngOnInit () {
    this.httpClient.get(BaseUrl.baseUri + '/getUsers').subscribe(
      (data: Array<UserNameTemplateI>) => {
        console.log(data);
        data.forEach(d => {
          this.userNames.push(d.username);
        });
      },
      error => {
        console.log(error);
        throw (error);
      }
    );

  }

}
