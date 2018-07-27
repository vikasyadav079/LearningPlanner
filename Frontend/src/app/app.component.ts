import { AuthenticationService, NextComponentC } from './authentication-service/authentication.service';
import { LoaderService } from './loader/loader.service';
import { Component, OnInit} from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  showloader: Boolean;
  isloggedIn: NextComponentC;

  constructor(private loaderService: LoaderService, private auth: AuthenticationService) { }

  ngOnInit() {
    this.loaderService.state.subscribe(
      (value: Boolean) => this.showloader = value
    );

    this.auth.isLoggedIn().subscribe(
      (data: NextComponentC) => {
        this.isloggedIn = data;
        console.log(data);
      },
      error => {
        console.log(error);
        throw (error);
      }
    );
  }




}
