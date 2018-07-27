import { AuthenticationService, BaseUrl } from './../authentication-service/authentication.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

class CAlert {
  type: string;
  message: string;
}

interface UserNameTemplateI {
  _id: String;
  username: String;
}

interface TemplateNameSchemaI {
  _id: String;
  TemplateName: String;
}


interface AreaDetailsSchemaI {
  TopicHeading: String;
  DueDate: String;
  Status: String;
  Mentor: Array<String>;
  DocLocation: Array<String>;
  Comments: String;
  TopiceDescription: String;
}

interface AreaDetailsI {
  AreaName: String;
  AreaDetails: Array<AreaDetailsSchemaI>;
}

interface CategoryDetailsI {
  CategoryName: String;
  CategoryDetails: Array<AreaDetailsI>;
}

interface TemplateDetailsI {
  _id: String;
  TemplateName: String;
  TemplateDetails: Array<CategoryDetailsI>;
}


class HistoryDetailsSchema {
  seqno: number;
  submitter: String;
  SubmittedDate: Date;
  Notes: String;
}

class TemplateUserCategoryDetails {
  CategoryName: String;
  AreaName: String;
  DueDate: string;
  TopicName: String;
  Status: String;
  History: Array<HistoryDetailsSchema>;
}


class TemplateUserRelSchema {
  TemplateName: String;
  AssigneeName: String;
  JoiningDate: Date;
  Details: Array<TemplateUserCategoryDetails>;

}

interface TopicHeadingsI {
  TopicHeading: String;
}

interface AreaDetailsForTemplateNameI {
  AreaDetails: Array<TopicHeadingsI>;
}

interface CategoryDetailsForTopicHeadingsI {
  CategoryDetails: Array<AreaDetailsForTemplateNameI>;
}

interface TopicHeadingsSchemaI {
  _id: String;
  TemplateDetails: Array<CategoryDetailsForTopicHeadingsI>;
}

class TemplateHeadingsDueDateSchemaC {
  dueDate: string;
  HeadingName: String;
}


@Component({
  selector: 'app-assign-template',
  templateUrl: './assign-template.component.html',
  styleUrls: ['./assign-template.component.css']
})
export class AssignTemplateComponent implements OnInit, OnChanges {

  showAlert: Boolean;
  alertType: CAlert;
  userNames: Array<String>;
  templateNames: Array<String>;
  templateUserRelSchemaO: TemplateUserRelSchema;
  templateUserCategoryDetailsO: TemplateUserCategoryDetails;
  historyDetailsSchemaO: HistoryDetailsSchema;
  topicHeadings: Array<TemplateHeadingsDueDateSchemaC>;

  constructor(private httpClient: HttpClient, private datePipe: DatePipe, private router: Router,
    private authenticationService: AuthenticationService) {
    this.userNames = new Array();
    this.templateNames = new Array();
    this.templateUserRelSchemaO = new TemplateUserRelSchema();
    this.templateUserRelSchemaO.Details = new Array();
    this.templateUserCategoryDetailsO = new TemplateUserCategoryDetails();
    this.templateUserCategoryDetailsO.History = new Array();
    this.historyDetailsSchemaO = new HistoryDetailsSchema();
    this.topicHeadings = new Array();
    this.showAlert = false;
    this.alertType = new CAlert();

  }

  ngOnChanges () {
    this.showAlert = false;
  }

  ngOnInit() {
    this.showAlert = false;
    this.alertType = new CAlert();
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

    // get template name from template meta data
    this.httpClient.get(BaseUrl.baseUri + '/getTemplatebyName').subscribe(
      (data: Array<TemplateNameSchemaI>) => {
        console.log(data);
        data.forEach(d => {
          this.templateNames.push(d.TemplateName);
        });
      },
      error => {
        console.log(error);
        throw (error);
      }
    );
  }

  async getTemplateDetails (templateName: String): Promise<TemplateDetailsI> {
    const params = new HttpParams().set('TemplateName', ( templateName as string) );
    let response: Promise<TemplateDetailsI>;
    const url = BaseUrl.baseUri + '/getTemplateDetailsbyName';
    response =  await this.httpClient.get(url, {params}).toPromise() as Promise<TemplateDetailsI>;
    console.log(response);
    return response;

  }

  onSubmit(templateName: String, assigneeName: String, joiningDate: Date) {
    this.showAlert = false;

    if (this.userNames.indexOf(assigneeName) >= 0 || this.templateNames.indexOf(templateName) >= 0) {
        const params = new HttpParams().set('TemplateName', ( templateName as string) );
        let data: TemplateDetailsI;
        this.getTemplateDetails(templateName).then(
          (templateData: TemplateDetailsI) => {
            data = templateData;
            console.log(data);
            this.templateUserRelSchemaO = new TemplateUserRelSchema();
            this.templateUserRelSchemaO.Details = new Array();
            this.templateUserRelSchemaO.TemplateName = data.TemplateName;
            this.templateUserRelSchemaO.AssigneeName = assigneeName;
            this.templateUserRelSchemaO.JoiningDate = joiningDate;
            data.TemplateDetails.forEach(td => {
              td.CategoryDetails.forEach(cd => {
                cd.AreaDetails.forEach(ad => {
                    let index = -1;
                    this.templateUserCategoryDetailsO = new TemplateUserCategoryDetails();
                    this.templateUserCategoryDetailsO.CategoryName = td.CategoryName;
                    this.templateUserCategoryDetailsO.AreaName = cd.AreaName;
                    this.templateUserCategoryDetailsO.TopicName = ad.TopicHeading;
                    index = this.topicHeadings.findIndex(obj => {
                      return obj.HeadingName === this.templateUserCategoryDetailsO.TopicName;
                    });
                    if ( ! (index < 0 ) ) {
                      this.templateUserCategoryDetailsO.DueDate = this.topicHeadings[index].dueDate;
                    } else {
                      this.templateUserCategoryDetailsO.DueDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
                    }
                    this.templateUserCategoryDetailsO.Status = 'Planned';
                    this.templateUserCategoryDetailsO.History = [];
                    this.templateUserRelSchemaO.Details.push(this.templateUserCategoryDetailsO);
                });
              });
            });
            const url = BaseUrl.baseUri + '/submitAssignedTemplate';
            this.httpClient.post( url , {templateToBeSaved: this.templateUserRelSchemaO}).subscribe(
              data1 => {
                console.log('Data Saved Successfully ');
                console.log(data1);
                this.showAlert = true;
                this.alertType.type = 'success';
                this.alertType.message = 'Data saved successfully';
                this.router.navigate(['./subAdminManagement']);
               },
              err => {
                console.log(err);
                throw (err);
              }
            );
          }
        ).catch(function ( error ) {
          console.log(error);
          throw error;
        });
    } else {
      this.showAlert = true;
      this.alertType.message = 'Select Assignee Name ';
      this.alertType.type = 'danger';
    }
  }

  getAllTopicNamebyUsername (currentTemplateName: string) {
    const params =  new HttpParams().set('TemplateName', currentTemplateName);

    this.httpClient.get(BaseUrl.baseUri + '/getTopicsNamebyTemplate', {params}).subscribe(
      (data: TopicHeadingsSchemaI) => {
        console.log(data);
        data.TemplateDetails.forEach(td => {
          td.CategoryDetails.forEach( cd => {
            cd.AreaDetails.forEach(ad => {
              this.topicHeadings.push({dueDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'), HeadingName: ad.TopicHeading});
            });
          }) ;
        });
        console.log(this.topicHeadings);
      },
      error => { console.log(error);
        throw (error);
      }
    );

  }

  getTopics (currentTemplateName: string) {
    this.getAllTopicNamebyUsername(currentTemplateName);
  }

  closeAlert() {
    this.showAlert = false;
  }

}
