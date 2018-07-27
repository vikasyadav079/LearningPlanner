import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseUrl } from './../authentication-service/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from './../loader/loader.service';
import { map } from 'rxjs/operators';
import { Component, OnInit, Pipe, OnChanges } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

class CAlert {
  type: string;
  message: string;
}


interface TableHeaders {
  SubAdminModifyTemplateHeadings: Array<String>;
  id: String;
}

class AreaDetailsSchemaC {
  TopicHeading: String;
  DueDate: String;
  Status: String;
  Mentor: Array<String>;
  DocLocation: Array<String>;
  Comments: String;
  TopicDescription: String;
}

class AreaDetailsC {
  AreaName: String;
  AreaDetails: Array<AreaDetailsSchemaC>;
}

class CategoryDetailsC {
  CategoryName: String;
  CategoryDetails: Array<AreaDetailsC>;
}

class TemplateDetailsC {
  _id: String;
  TemplateName: String;
  TemplateDetails: Array<CategoryDetailsC>;
}

class TableBodySchema {
  CategoryName: String;
  AreaName: String;
  TopicHeading: String;
  TopicDescription: String;
  Mentor: Array<String>;
  DocLocation: Array<String>;
}

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit, OnChanges {

  headings: Array<String> ;
  headers: Array<String>;
  tableBodySingleO;
  keyValues: Array<String>;
  currentUser: String;
  isEditSave: Array<string>;
  isEditable: Array<boolean>;
  tableBodyO: Array<TableBodySchema>;
  currentTemplateName: string;
  currentTemplateDetails: TemplateDetailsC;
  mentorListByCurrentTopic: Array<String>;
  docListByCurrentTopic: Array<String>;
  isModifyMentorEnable: boolean;
  isModifyDocListEnable: boolean;
  currentMentorArray: Array<String>;
  mentorO: String;
  docLocationO: String;
  currentEditableRow: number;
  mentorOSingle: String;
  showAddNewTopicModule: boolean;
  addNewTopicForm: FormGroup;
  mentorListByNewTopic: Array<String>;
  docListByNewTopic: Array<String>;
  showAlert: boolean;
  alertType: CAlert;


  constructor(private http: HttpClient,
    private loaderService: LoaderService,
    private router: ActivatedRoute
  ) {
    this.alertType = new CAlert();
    this.showAlert = false;
    this.showAddNewTopicModule = false;
    this.currentMentorArray = new Array();
    this.loaderService.display(true);
    this.keyValues = new Array<String>();
    this.currentUser = '';
    this.tableBodyO = new Array();
    this.currentTemplateDetails = new TemplateDetailsC();
    // this.mentorListByCurrentTopic = new Array();
    this.docListByCurrentTopic = new Array();
    this.isModifyMentorEnable = false;
    this.isModifyDocListEnable = false;
    this.mentorO = '';
    this.docLocationO = '';
    this.currentEditableRow = -1;
    this.mentorOSingle = '';
  }

  ngOnInit() {
    this.loadHeading();
  }

  loadHeading() {
    this.showAlert = false;
    this.mentorListByNewTopic = new Array();
    this.docListByNewTopic = new Array();
    this.showAddNewTopicModule = false;
    this.mentorListByCurrentTopic = new Array();
    this.docListByCurrentTopic = new Array();
    this.mentorO = '';
    this.mentorOSingle = '';
    this.docLocationO = '';
    this.isModifyMentorEnable = false;
    this.isModifyDocListEnable = false;
    const queryparams = this.router.snapshot.queryParams;
    const templateName = queryparams['templateName'];
    this.currentTemplateName = templateName;
      // http calls start
      this.loaderService.display(true);
       this.http.get(BaseUrl.baseUri + '/subAdminModifyTemplateHeader').pipe(
         map((data: TableHeaders) => data
       )).subscribe(
         data => {
          this.loaderService.display(false);
           this.headers = data['SubAdminModifyTemplateHeadings'];
         },
         err => {
          this.loaderService.display(false);
          throw err;
         }
       );
      const params = new HttpParams().set('TemplateName', templateName);
        this.http.get(BaseUrl.baseUri + '/getTemplateDetailsbyName', {params}).subscribe(
         (data: TemplateDetailsC) => {
           console.log(data);
           this.currentTemplateDetails = data;
           data.TemplateDetails.forEach(td => {
              td.CategoryDetails.forEach(cd => {
                cd.AreaDetails.forEach(ad => {
                  const tableBodySingleO = new TableBodySchema();
                  tableBodySingleO.CategoryName = td.CategoryName;
                  tableBodySingleO.AreaName = cd.AreaName;
                  tableBodySingleO.TopicHeading = ad.TopicHeading;
                  tableBodySingleO.TopicDescription = ad.TopicDescription;
                  // tableBodySingleO.Mentor = ad.Mentor;
                  tableBodySingleO.Mentor = ['fadfaa', 'maa'];
                  tableBodySingleO.DocLocation = ad.DocLocation;
                  this.tableBodyO.push(tableBodySingleO);
                });
              });
           });
           this.isEditable = new Array(this.tableBodyO.length);
           this.isEditSave = new Array(this.tableBodyO.length);
           for (let i = 0; i < this.tableBodyO.length; i++) {
              this.isEditable[i] = false;
              this.isEditSave[i] = 'Edit';
           }
         },
         error => {
           console.log( ' Error is ' + error);
           throw (error);
        }
       );
  }

  ngOnChanges() {
    this.showAlert = false;
  }


  EditTopic (i: number, mentorList , docList) {
    if ( this.showAddNewTopicModule) {
      this.showAddNewTopicModule = false;
    }
    this.mentorListByCurrentTopic = new Array();
    this.docListByCurrentTopic = new Array();
    if (!this.isEditable[i]) {
      this.isEditable[i] = true;
      if ( this.currentEditableRow !== i) {
        for ( let test1 = 0 ; test1 < docList.length ; test1++) {
          this.docListByCurrentTopic.push(docList[test1]);
        }
        for ( let test1 = 0 ; test1 < mentorList.length ; test1++) {
          this.mentorListByCurrentTopic.push(mentorList[test1]);
        }
        this.currentEditableRow = i;
        this.isModifyMentorEnable = true;
        this.isModifyDocListEnable = true;
      } else {
        for ( let test1 = 0 ; test1 < docList.length ; test1++) {
          this.docListByCurrentTopic.push(docList[test1]);
        }
        for ( let test1 = 0 ; test1 < mentorList.length ; test1++) {
          this.mentorListByCurrentTopic.push(mentorList[test1]);
        }
        this.isModifyMentorEnable = !this.isModifyMentorEnable;
        this.isModifyDocListEnable = !this.isModifyDocListEnable;
      }
    } else {
      this.currentEditableRow = -1;
      this.isEditable[i] = false;
      this.isModifyMentorEnable = false;
      this.isModifyDocListEnable = false;

    }

  }

  DeleteTopic (i: number, tableBodySingleO) {
    const queryparams = this.router.snapshot.queryParams;
    const templateName = queryparams['templateName'];
      let categoryLength = 0;
      let areaLength = 0;
      let topicLength = 0;
      const TopicDetails = {
        TemplateName: templateName,
        CategoryName: tableBodySingleO.CategoryName,
        AreaName: tableBodySingleO.AreaName,
        TopicName: tableBodySingleO.TopicHeading
      };
      let s: string;
      this.currentTemplateDetails.TemplateDetails.forEach(td => {
        categoryLength = categoryLength + 1;
      });
      const CategoryDetailsO: Array<CategoryDetailsC> =
          this.currentTemplateDetails.TemplateDetails.filter( k => k.CategoryName === tableBodySingleO.CategoryName);
      CategoryDetailsO[0].CategoryDetails.forEach(cd => {
        console.log(cd.AreaName);
        areaLength = areaLength + 1;
        if (cd.AreaName === TopicDetails.AreaName) {
          cd.AreaDetails.forEach(ad => {
            console.log(ad.TopicHeading);
            topicLength = topicLength + 1;
          });
        }
      });
      if (topicLength === 1) {
        if (areaLength === 1) {
          if (categoryLength === 1) {
            s = 'deletion of this topic heading will result into deletion of its template';
          } else {
            s = 'Deletion of Topic will result into deletion of its category';
          }
        } else {
          s = 'Deletion will result into deletion of its Area';
        }
      } else {
        s = 'Want to delete topic';
      }
      const r = confirm(s);
      if (r ) {
        this.tableBodyO.splice(i , 0);
        this.http.post(BaseUrl.baseUri + '/deleteTopic', TopicDetails ).subscribe(
          data => {
            this.showAlert = true;
            this.alertType.type = 'success';
            this.alertType.message = 'Topic deleted successfully';
            console.log(data);
          },
          error => {
            this.tableBodyO.splice(i , 1 , tableBodySingleO);
            throw error;
          }
        );
      }
  }

  SaveTopicEdit (i: number, myValue: HTMLTableRowElement, tableBodySingleO) {
    const queryparams = this.router.snapshot.queryParams;
    const templateName = queryparams['templateName'];
    const UpdatedTopicDetails = {
      TemplateName: templateName,
      CategoryName: myValue.cells.namedItem('categoryname').textContent,
      AreaName: myValue.cells.namedItem('areaname').textContent,
      TopicName: myValue.cells.namedItem('topicname').textContent,
      MentorList: this.tableBodyO[i].Mentor,
      DocLocationList: this.tableBodyO[i].DocLocation,
      TopicDesc:  myValue.cells.namedItem('topicdesc').textContent
    };

    const OldTopicDetails = {
      TemplateName: templateName,
      CategoryName: tableBodySingleO.CategoryName,
      AreaName: tableBodySingleO.AreaName,
      TopicName: tableBodySingleO.TopicHeading
    };
    this.http.put(BaseUrl.baseUri + '/saveModifiedData',
     {OldTopicDetails: OldTopicDetails, UpdatedTopicDetails: UpdatedTopicDetails}).subscribe(
      data => {
        console.log(data);
        this.showAlert = true;
        this.alertType.type = 'success';
        this.alertType.message = 'Data modified successfully';
        this.isEditable[i] = !this.isEditable[i];
        this.isModifyMentorEnable = !this.isModifyMentorEnable;
        this.isModifyDocListEnable = !this.isModifyDocListEnable;
      },
      error => {
        console.log(error);
        throw error;
      }
    );

  }

  addMentor() {
    if (this.mentorListByCurrentTopic.indexOf(this.mentorOSingle) >= 0) {
      this.showAlert = true;
      this.alertType.type = 'danger';
      this.alertType.message = 'Mentor already existing';
    } else {
      this.mentorListByCurrentTopic.splice(0, 0, this.mentorOSingle);
      this.mentorOSingle = '';
    }
  }

  currentMentor(mentorName: String) {
    this.mentorOSingle = mentorName;
  }

  deleteMentor() {
    if (this.mentorOSingle.length > 0) {
      const index = this.mentorListByCurrentTopic.indexOf(this.mentorOSingle) ;
      if ( index >= 0 ) {
        this.mentorListByCurrentTopic.splice(index, 1);
        this.mentorOSingle = '';
      }
    }
  }

  saveMentor () {
    if ( this.mentorListByCurrentTopic.length > 0) {
      this.tableBodyO[this.currentEditableRow].Mentor = new Array();
      for ( let i = 0 ; i < this.mentorListByCurrentTopic.length ; i++) {
        this.tableBodyO[this.currentEditableRow].Mentor.push(this.mentorListByCurrentTopic[i]);
      }
    } else {
      this.showAlert = true;
      this.alertType.type = 'danger';
      this.alertType.message = 'Mentor list can not be empty';
    }

  }

  saveDocLocation () {
    if ( this.docListByCurrentTopic.length > 0) {
      this.tableBodyO[this.currentEditableRow].DocLocation = new Array();
      for ( let i = 0 ; i < this.docListByCurrentTopic.length ; i++ ) {
        this.tableBodyO[this.currentEditableRow].DocLocation.push(this.docListByCurrentTopic[i]);
      }
    } else {
      this.showAlert = true;
      this.alertType.type = 'danger';
      this.alertType.message = 'Doc list can not be empty. You can fill as "NA" in case of non availability of Document list';
    }

  }

  addDocLocation() {
    // check if user already existing
    if (this.docListByCurrentTopic.indexOf(this.docLocationO) >= 0) {
      this.showAlert = true;
      this.alertType.type = 'danger';
      this.alertType.message = 'Document already existing';
    } else {
      this.docListByCurrentTopic.splice(0, 0, this.docLocationO);
      this.docLocationO = '';
    }
  }

  currentDocLocation(docLocationName: String) {
    this.docLocationO = docLocationName;
  }

  deleteDocLocation() {
    if (this.docLocationO.length > 0) {
      const index = this.docListByCurrentTopic.indexOf(this.docLocationO) ;
      if ( index >= 0 ) {
        this.docListByCurrentTopic.splice(index, 1);
        this.docLocationO = '';
      }
    }
  }

  addNewTopic () {
    this.mentorListByNewTopic = new Array();
    this.docListByNewTopic = new Array();
    this.showAddNewTopicModule = !this.showAddNewTopicModule;
    if (this.isModifyMentorEnable) {
      this.isModifyMentorEnable = false;
    }
    if (this.isModifyDocListEnable) {
      this.isModifyDocListEnable = false;
    }
  }

  submitNewTopicDetails (categoryName, areaName, topicHeading, topicDesc) {
    if (categoryName === '' || areaName === '' || topicHeading === '' || topicDesc === '' ||
        this.mentorListByNewTopic.length <= 0 || this.docListByNewTopic.length <= 0) {
      this.showAlert = true;
      this.alertType.type = 'danger';
      this.alertType.message = 'Kindly fill all the details before submitting.' ;
    } else {
      const r = confirm('Are you sure you want to add this topic details ?');
      if (r) {
        const queryparams = this.router.snapshot.queryParams;
        const templateName = queryparams['templateName'];
        const newTopicDetails = {
          TemplateName: queryparams['templateName'],
          CategoryName: categoryName,
          AreaName: areaName,
          TopicHeading: topicHeading,
          TopicDescription: topicDesc,
          MentorList: this.mentorListByCurrentTopic,
          DocLocationList: this.docListByCurrentTopic
        };
        this.http.post(BaseUrl.baseUri + '/saveNewTopicDetails' , newTopicDetails).subscribe(
          data => {
            console.log('Data Saved successfully', data);
            this.showAlert = true;
            this.alertType.type = 'success';
            this.alertType.message = 'Data saved successfully.' ;
          },
          error => {
            console.log('error occured', error);
            this.showAlert = true;
            this.alertType.type = 'danger';
            this.alertType.message = 'Issue in saving details. Kindly check logs for more information' ;
          }
        );
      }
    }
  }

  closeAlert() {
    this.showAlert = false;
  }
}
