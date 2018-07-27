import { AuthenticationService, BaseUrl } from './../authentication-service/authentication.service';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';

export class AssigneeListSchema {
  _id: string;
  TemplateName: string;
  AssigneeName: string;
}

export interface SubadmintabledataI {
  _id: String;
  name: string;
  created_at: String;
  creater: String;
  updated_at: String;
  assigned_to: Array<String>;
  owner_group: String;
  owner: Array<String>;
  description: String;
}


export class SubadmintabledataC implements SubadmintabledataI {
  _id: String;
  name: string;
  created_at: String;
  creater: String;
  updated_at: String;
  assigned_to: Array<String>;
  owner_group: String;
  owner: Array<String>;
  description: String;
}

class TemplateMetadataSchema {
  CreatedAt: Date;
  Creater: String;
  Owner: Array<String>;
  OwnerGroup: String;
  ProgramName: Array<String>;
  TemplateDescription: String;
  TemplateName: String;
  UpdatedAt: Date;
  _id: String;
}

interface UserNameTemplateI {
  _id: String;
  username: String;
}

class CAlert {
  type: string;
  message: string;
}


@Component({
  selector: 'app-manage-template',
  templateUrl: './manage-template.component.html',
  styleUrls: ['./manage-template.component.css']
})
export class ManageTemplateComponent implements OnInit, OnChanges {
  tableheadings: String[] ;
  tableBody: Array<SubadmintabledataC>;
  assigneeName: string;
  assigneeList: Array<AssigneeListSchema>;
  templateNameForAssigneeName: Array<string>;
  userNames: Array<String>;
  isDeleteTemplate: string;
  templateNames: Array<String>;
  isDeleteO: boolean;
  showAlert: Boolean;
  alertType: CAlert;
  isAssigneeStatusO: boolean;
  viewAssigneeStatus: string;
  modifyTemplateString: string;
  isModifyTemplateEnable: boolean;

  constructor(private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService) {
      // User can see only those templates of which he is owner or mentor
    this.assigneeName = '';
    this.assigneeList = new Array();
    this.isAssigneeStatusO = false;
    this.viewAssigneeStatus = 'View Status';
    this.isModifyTemplateEnable = false;

    this.userNames = new Array();
    this.templateNameForAssigneeName = new Array();
    this.isDeleteTemplate = 'Delete Template';
    this.templateNames = new Array();
    this.isDeleteO = false;
    this.showAlert = false;
    this.alertType = new CAlert();
    this.modifyTemplateString = 'Edit Template';

   }

   ngOnChanges () {
    this.showAlert = false;
    this.alertType = new CAlert();
   }

  ngOnInit() {
    this.isModifyTemplateEnable = false;
    this.isAssigneeStatusO = false;
    this.showAlert = false;
    this.alertType = new CAlert();
    this.isDeleteO = false;
    this.http.get(BaseUrl.baseUri + '/getUsers').subscribe(
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

    this.http.get(BaseUrl.baseUri + '/getSubadmintableheading').subscribe(
      (data: Object) => {
        console.log('Sub admin table heading ');
        console.log(data);
        this.tableheadings = data['tableheadings'];
      },
      error => {
        console.log(error);
        throw (error);
      }
    );

    this.getTemplateDetailsbyCreaterName()
    .then(
      (templatedata: Array<TemplateMetadataSchema>) => {
        console.log(templatedata);
        this.tableBody = new Array();
        templatedata.forEach(d => {
          const subadmintabledataO = new SubadmintabledataC();
          subadmintabledataO.name = d.TemplateName as string;
          console.log('Assigning Template Name here ');
          this.templateNameForAssigneeName.push(d.TemplateName as string);
          console.log(this.templateNameForAssigneeName);
          subadmintabledataO.created_at = this.datePipe.transform(d.CreatedAt, 'yyyy-MM-dd') ;
          subadmintabledataO.creater = d.Creater; // creater in place of assignee name
          subadmintabledataO.owner = d.Owner;
          subadmintabledataO.owner_group = d.OwnerGroup;
          subadmintabledataO.updated_at  = this.datePipe.transform(d.UpdatedAt, 'yyyy-MM-dd');
          subadmintabledataO.description  = d.TemplateDescription;
          this.tableBody.push(subadmintabledataO);
        });
        this.getAsigneebyTemplateName();
      }
      )
    .catch( function(error ) {
      throw (error);
    });
  }

  getAsigneebyTemplateName() {
    console.log(this.templateNameForAssigneeName);
    this.http.post(BaseUrl.baseUri + '/getAssigneebyTemplateName', {TemplateNameArray: this.templateNameForAssigneeName}).subscribe(
      ( data: Array<AssigneeListSchema>) =>  {
        console.log(data);
        this.assigneeList = data;
        console.log(this.assigneeList);
      },
      error => {
        console.log(error);
        throw (error);
      }
    );
  }

  newTemplate() {
      this.router.navigate(['/createNewtemplate']);
  }

  detailsView(data: SubadmintabledataI) {
    console.log(data);
    const templatename = data['name'];
    this.router.navigate(['/newtemplate'], {queryParams: {'templatename' : templatename}});
  }

  async getTemplateDetailsbyCreaterName (): Promise<Array<TemplateMetadataSchema>> {
    const username = this.authenticationService.getUserDetails().username as string;
    const params = new HttpParams().set('UserName', username);
    const url = BaseUrl.baseUri + '/getSubadmintablebody';
    const response = await this.http.get(url, {params}).toPromise() as Promise<Array<TemplateMetadataSchema>>;
    return response;
  }

  assignTemplate() {
    this.router.navigate(['/assignTemplate']);
  }

  open () {
    const modalRef = this.modalService.open(ModalComponent);
  }

  deleteTemplate () {
    if (this.isDeleteTemplate === 'Delete Template') {
      this.isDeleteTemplate = 'Revert';
    } else {
      this.isDeleteTemplate = 'Delete Template';
    }
    this.isDeleteO = !this.isDeleteO;
  }

  selectTemplateToDelete (selectedTemplate: string) {
    console.log(selectedTemplate);
    const r = confirm('Want to delete selected Template ' + selectedTemplate);
    if (r ) {
      const t = this.templateNameForAssigneeName.indexOf(selectedTemplate);
      this.templateNameForAssigneeName.splice(t , 1);
      const params = new HttpParams().set('TemplateName', selectedTemplate);
      this.http.delete(BaseUrl.baseUri + '/deleteTemplateByName', {params}).subscribe(
        (data) => {
          console.log(data);
          this.showAlert = true;
          this.alertType.type = 'success';
          this.alertType.message = 'Selected templeted deleted successfully';
        },
        error => {
          this.templateNameForAssigneeName.splice(t , 0 , selectedTemplate);
          console.log(error);
          this.showAlert = true;
          this.alertType.type = 'danger';
          this.alertType.message = 'Error while deleting template';
          throw (error);
        }
      );
      console.log('Say delete');
    } else {
      console.log('say false');
    }
  }

  closeAlert() {
    this.showAlert = false;
  }

  viewStatus () {
    if (this.viewAssigneeStatus === 'View Status') {
      this.viewAssigneeStatus = 'Hide Status';
    } else {
      this.viewAssigneeStatus = 'View Status';
    }
    this.isAssigneeStatusO = !this.isAssigneeStatusO;
  }

  selectUserToViewUpdates (userName: string) {
    const r = confirm('View Assignee ' + userName + ' ?');
    if (r) {
        window.localStorage.setItem('SelectedUser' , userName);
        this.router.navigate(['./home']);
    } else {

    }
    console.log('UserName is ' + userName);
  }

  editTemplate () {
    if (this.modifyTemplateString === 'Edit Template') {
      this.modifyTemplateString = 'Revert';
    } else {
      this.modifyTemplateString = 'Edit Template';
    }
    this.isModifyTemplateEnable = !this.isModifyTemplateEnable;
  }

  editTemplateDetails (templateName: string) {
    const r = confirm('Edit selected template ' + templateName);
    if ( r ) {
      this.router.navigate(['./editTemplate'], {queryParams: {'templateName': templateName}});
    } else {}
  }

}
