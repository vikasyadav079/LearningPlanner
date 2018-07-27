import { Component, OnChanges, OnInit, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-global-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.css']
})
export class GlobalErrorComponent implements OnChanges, OnInit, OnDestroy {

  UUID: string;

  constructor() {
    this.UUID = 'Vikas';
  }

  ngOnChanges () {
    this.UUID = window.localStorage.getItem('mean-token');
  }

  ngOnInit() {
    this.UUID = window.localStorage.getItem('mean-token');
  }
  ngOnDestroy () {
    this.UUID = window.localStorage.getItem('mean-token');
  }


 }
