import { BaseUrl } from './../authentication-service/authentication.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges } from '@angular/core';
import { TopicDetailsComSchema } from '../home/topicdetailscom.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

class CAlert {
  type: string;
  message: string;
}


interface TopicDetailsI {
  TopicHeading: String;
  Mentor: Array<String>;
  DocLocation: Array<String>;
  _id: String;
  TopicDescription?: String;
}


interface AreaDetailsI {
  AreaName: String;
  AreaDetails: Array<TopicDetailsI>;
}


interface TopicDetailsSchemaI {
  _id: String;
  CategoryName: String;
  CategoryDetails: Array<AreaDetailsI>;
}


class TopicDetailsC {
  _id: String;
  TemplateName: String;
  CategoryName: String;
  AreaName: String;
  Mentor: Array<String>;
  DocLocation: Array<String>;
  TopicHeading: String;
  TopicDescription?: String;
}

class TemplateMetaDataSchema {
  ProgramName: Array<String>;
  Owner: Array<String>;
  _id: String;
  TemplateName: String;
  OwnerGroup: String;
  CreatedAt: Date;
  UpdatedAt: Date;
  Creater: String;
  TemplateDescription?: String;
}

class HistorySchema {
  seqno: number;
  submitter: String;
  SubmittedDate: string;
  Notes: String;
}

class AssigneeProgressOnTopic {
  _id: string;
  AreaName: String;
  CategoryName: String;
  TopicName: String;
  DueDate: string;
  Status: String;
  StartDate?: String;
  CompletionDate?: String;
  History: Array<HistorySchema>;
}


@Component({
  selector: 'app-topicdetails',
  templateUrl: './topicdetails.component.html',
  styleUrls: ['./topicdetails.component.css']
})
export class TopicdetailsComponent implements OnInit, OnChanges {

  currentTopicDetails: TopicDetailsComSchema;
  currentTemplateMetadaDetailsO: TemplateMetaDataSchema;
  topicStatusHistoryId: AssigneeProgressOnTopic;
  topicStatusHistory: AssigneeProgressOnTopic;
  currentTemplateO: TopicDetailsC;
  commentDetails: String;
  status: String;
  startDate: String;
  completedDate: String;
  showAlert: Boolean;
  alertType: CAlert;

  constructor(
  private http: HttpClient,
  private datePipe: DatePipe,
  private router: Router
  ) {
    this.topicStatusHistory = new AssigneeProgressOnTopic();
    this.currentTopicDetails = new TopicDetailsComSchema();
    this.topicStatusHistoryId = new AssigneeProgressOnTopic();
    this.currentTemplateMetadaDetailsO = new TemplateMetaDataSchema();
    this.topicStatusHistoryId.History = new Array();
    this.currentTemplateO = new TopicDetailsC();
    this.currentTemplateO.Mentor = new Array();
    this.currentTemplateO.DocLocation = new Array();
    this.status = '';
    this.showAlert = false;
    this.alertType = new CAlert();
  }

  ngOnChanges () {
    this.showAlert = false;
    this.alertType = new CAlert();
  }

  ngOnInit() {
    this.showAlert = false;
    this.alertType = new CAlert();
    const currTopicDetails = JSON.parse(window.localStorage.getItem('currentTopicDetails'));
    this.currentTopicDetails.AssigneeName = currTopicDetails.AssigneeName ;
    this.currentTopicDetails.CategoryName = currTopicDetails.CategoryName;
    this.currentTopicDetails.AreaName = currTopicDetails.AreaName;
    this.currentTopicDetails.TopicName = currTopicDetails.TopicName;
    this.currentTopicDetails.TemplateName = currTopicDetails.TemplateName;
   console.log(this.currentTopicDetails);

    const params = new HttpParams().set('TemplateName' , this.currentTopicDetails.TemplateName as string);

    this.http.get(BaseUrl.baseUri + '/templateMetadata' , {params} ).subscribe(
      (data: TemplateMetaDataSchema) => {
        console.log('Vikas Receive data from backend for TemplateMetaData ');
        console.log(data);
        this.currentTemplateMetadaDetailsO._id = data._id;
        this.currentTemplateMetadaDetailsO.TemplateName = data.TemplateName;
        this.currentTemplateMetadaDetailsO.OwnerGroup = data.OwnerGroup;
        this.currentTemplateMetadaDetailsO.CreatedAt = data.CreatedAt;
        this.currentTemplateMetadaDetailsO.UpdatedAt = data.UpdatedAt;
        this.currentTemplateMetadaDetailsO.Creater = data.Creater;
        this.currentTemplateMetadaDetailsO.TemplateDescription = data.TemplateDescription;
        this.currentTemplateMetadaDetailsO.ProgramName = data.ProgramName;
        this.currentTemplateMetadaDetailsO.Owner = data.Owner;
        console.log(this.currentTemplateMetadaDetailsO);
      },
      error => {
        console.log(error);
        throw (error);
      }
    );


    this.http.post(BaseUrl.baseUri + '/templateUserrel', this.currentTopicDetails)
    .subscribe(
      (data: Array<AssigneeProgressOnTopic>) => {
        console.log(data);
        this.topicStatusHistoryId = new AssigneeProgressOnTopic();
        this.topicStatusHistoryId.Status = data[0].Status;
        this.status = data[0].Status;
        this.topicStatusHistoryId.DueDate = this.datePipe.transform(data[0].DueDate, 'yyyy-MM-dd');
        this.topicStatusHistoryId.StartDate = this.datePipe.transform(data[0].StartDate, 'yyyy-MM-dd');
        this.topicStatusHistoryId.CompletionDate = this.datePipe.transform(data[0].CompletionDate, 'yyyy-MM-dd');
        this.topicStatusHistoryId.History = data[0].History;
      },
      error => {
        console.log(error);
        throw (error);
      }
    );

    const currentTopicO =    {
      TemplateName : this.currentTopicDetails.TemplateName,
      CategoryName: this.currentTopicDetails.CategoryName,
      AreaName : this.currentTopicDetails.AreaName,
      TopicHeading : this.currentTopicDetails.TopicName
    };

    console.log(currentTopicO);

    this.http.put(BaseUrl.baseUri + '/fetchTemplateData', currentTopicO).subscribe(
      (data: Array<TopicDetailsSchemaI>) => {
        data.forEach(d => {
          this.currentTemplateO.TemplateName = this.currentTopicDetails.TemplateName;
          this.currentTemplateO.CategoryName = d.CategoryName;
          const cdA = d.CategoryDetails.filter(cd => cd.AreaName === currentTopicO.AreaName);
          this.currentTemplateO.AreaName = cdA[0].AreaName;
          const adA = cdA[0].AreaDetails.filter(ta => ta.TopicHeading === currentTopicO.TopicHeading);
          this.currentTemplateO.TopicHeading = adA[0].TopicHeading;
          this.currentTemplateO.TopicDescription = adA[0].TopicDescription;
          this.currentTemplateO.Mentor = adA[0].Mentor;
          this.currentTemplateO.DocLocation = adA[0].DocLocation;
          console.log(this.currentTemplateO);
        });
      },
      error => {
        console.log(error);
        throw (error);
      }

    );
  }

  addComment() {
    if ( this.commentDetails.length > 0) {
        const addCommentUpdate = {
          AssigneeName: this.currentTopicDetails.AssigneeName,
          TemplateName: this.currentTopicDetails.TemplateName,
          CategoryName: this.currentTopicDetails.CategoryName,
          AreaName: this.currentTopicDetails.AreaName,
          TopicName: this.currentTopicDetails.TopicName,
          HistoryUpdates: {
            seqno: ( this.topicStatusHistoryId.History.length as number ),
            submitter: this.currentTopicDetails.AssigneeName,
            SubmittedDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            Notes: this.commentDetails
          }
        };

        this.commentDetails = '';

        this.http.put(BaseUrl.baseUri + '/updateHistory', addCommentUpdate).subscribe(
          (data ) => {
            this.topicStatusHistoryId.History.push(addCommentUpdate.HistoryUpdates);
            console.log(this.topicStatusHistoryId.History);
            this.showAlert = true;
            this.alertType.type = 'success';
            this.alertType.message = 'Comment updated';
           },
          error => {
            this.showAlert = true;
            this.alertType.type = 'danger';
            this.alertType.message = 'Error occured while updating comment. Kindly check logs.';
            console.log(error);
           throw (error);
          }
        );
    }
  }

  submitUpdate() {
    let changeFlag = false;
    let query;
    console.log(this.topicStatusHistoryId.Status);
    console.log(this.status);
    if ( this.status !== '' && this.status !== this.topicStatusHistoryId.Status ) {
      if (this.status === 'Start') {
        changeFlag = true;
        this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        query = {
          TemplateName: this.currentTopicDetails.TemplateName,
          CategoryName: this.currentTopicDetails.CategoryName,
          AreaName: this.currentTopicDetails.AreaName,
          TopicName: this.currentTopicDetails.TopicName,
          Status: this.status,
          StartDate: this.startDate
        };
      }  else if ( this.status === 'Completed') {
        changeFlag = true;
        this.completedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        query = {
          TemplateName: this.currentTopicDetails.TemplateName,
          CategoryName: this.currentTopicDetails.CategoryName,
          AreaName: this.currentTopicDetails.AreaName,
          TopicName: this.currentTopicDetails.TopicName,
          Status: this.status,
          CompleteDate: this.completedDate
        };

      } else {
          changeFlag = false;
          this.router.navigate(['./home']);
      }
    }
    this.router.navigate(['./home']);

    if (changeFlag) {
      this.http.put(BaseUrl.baseUri + '/updateAssigneeStatus', query).subscribe(
        data => {
          this.showAlert = true;
          this.alertType.type = 'success';
          this.alertType.message = 'Comment updated';
          console.log(data);
          this.router.navigate(['./home']);
        } ,
        error => {
          this.showAlert = true;
          this.alertType.type = 'danger';
          this.alertType.message = 'Error occured while submitting update. Kindly check logs.';
          console.log(error);
          throw (error);
        }
      );
    }

  }

  closeAlert() {
    this.showAlert = false;
  }


  redirectBack() {
    this.router.navigate(['./home']);
  }
}
