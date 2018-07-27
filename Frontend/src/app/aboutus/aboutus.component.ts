import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {


  constructor(private router: Router) {}

  ngOnInit() { }

  testCall() {
    this.router.navigate([]);
  }

  nextPage() {
    this.router.navigate(['./errorPage']);

  }


}
