import { AuthenticationService, BaseUrl } from './../authentication-service/authentication.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { LoaderService } from './../loader/loader.service';
import { map } from 'rxjs/operators';
import { Component, OnInit, Pipe } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';



interface TableHeaders {
  headers: Array<String>;
  id: String;
}

export interface AreaDetailsI {
  Mentor: Array<String>;
  DocLocation: Array<String>;
  TopicHeading: String;
  DueDate: Date;
  Status: String;
  TopicDescription: String;
}


export class TemplateSchemaC {
  _id: String;
  TemplateName: String;
  CategoryName: String;
  AreaName: String;
  TopicHeading: String;
  DueDate: string;
  Status: String;
  TopicDescription: String;
}

export class TableBodyRowSchemaC {
  TemplateName: String;
  CategoryName: String;
  AreaName: String;
  TopicName: String;
  DueDate: String;
  Status: String;

}

interface AreaDetailsSchemaI {
  AreaName: String;
  CategoryName: String;
  Status: String;
  TopicName: String;
  DueDate: string;
}

interface TemplateBodySchemaI {
  _id: String;
  Details: Array<AreaDetailsSchemaI>;
  TemplateName: String;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  headings: Array<String> ;
  headers: Array<String>;
  tableBodyO: Array<TableBodyRowSchemaC>;
  tableBodySingleO;
  keyValues: Array<String>;
  currentUser: String;


  constructor(private http: HttpClient,
    private loaderService: LoaderService,
    private router: Router,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService
  ) {
    this.tableBodyO = new Array();
    this.loaderService.display(true);
    this.keyValues = new Array<String>();
    this.currentUser = '';
  }

  ngOnInit() {
    this.loadHeading();
  }

  loadHeading() {
      // http calls start
      this.loaderService.display(true);
       this.http.get(BaseUrl.baseUri + '/tableUserHeadings').pipe(
         map((data: TableHeaders) => data
       )).subscribe(
         data => {
          this.loaderService.display(false);
           this.headers = data['TableHeading'];
         },
         err => {
          this.loaderService.display(false);
          throw err;
         }
       );

       this.currentUser = window.localStorage.getItem('SelectedUser') ? window.localStorage.getItem('SelectedUser') :
                          this.authenticationService.getUserDetails().username;

      console.log('********************** Vikas *****************************');
      console.log(this.currentUser);
       const params = new HttpParams().set('AssigneeName', this.currentUser as string);

       this.http.get(BaseUrl.baseUri + '/getStatusDueDate', {params}).subscribe(
         (data: Array<TemplateBodySchemaI>) => {
           console.log(data);
            data.forEach(d => {
              d.Details.forEach(detailsO => {
                const tableBodyRowSingleO = new TableBodyRowSchemaC();
                tableBodyRowSingleO.TemplateName = d.TemplateName;
                tableBodyRowSingleO.CategoryName = detailsO.CategoryName;
                tableBodyRowSingleO.AreaName = detailsO.AreaName;
                tableBodyRowSingleO.TopicName = detailsO.TopicName;
                tableBodyRowSingleO.Status = detailsO.Status;
                tableBodyRowSingleO.DueDate = this.datePipe.transform(detailsO.DueDate, 'yyyy-MM-dd');
                this.tableBodyO.push(tableBodyRowSingleO);
              });
            });
            console.log(this.tableBodyO);
         },
         error => {
           console.log( ' Error is ' + error);
           throw (error);
        }
       );
  }


  DetailsPage(detailPage: TableBodyRowSchemaC) {
    const currDetailsO = {
      TemplateName: detailPage.TemplateName,
      CategoryName: detailPage.CategoryName,
      AreaName: detailPage.AreaName,
      TopicName: detailPage.TopicName,
      AssigneeName: this.authenticationService.getUserDetails().username
    };
    if (window.localStorage.getItem('currentTopicDetails') != null) {
      window.localStorage.removeItem('currentTopicDetails');
      window.localStorage.setItem('currentTopicDetails', JSON.stringify(currDetailsO));
    } else {
      window.localStorage.setItem('currentTopicDetails', JSON.stringify(currDetailsO));
    }
    this.router.navigate(['/details']);
  }
}
