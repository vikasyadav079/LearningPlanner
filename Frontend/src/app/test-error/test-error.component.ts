import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.css']
})
export class TestErrorComponent implements OnInit {
  Token: string;

  constructor() {
    this.Token = window.localStorage.getItem('mean-token');
  }

  ngOnInit() {
  }

}
