import { BaseUrl } from './../authentication-service/authentication.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnChanges } from '@angular/core';

class CAlert {
  type: string;
  message: string;
}


interface AdminRegFormI {
  _id: String;
  username: String;
  email: String;
  role: String;
  isActive: String;
  created_at: Date;
  updated_at: Date;
}

class AdminRegFormC {
  username: String;
  email: String;
  role: String;
  isActive: String;
  password: String;

  constructor(data) {
    this.username = data['username'];
    this.email = data['email'];
    this.role = data['selectRole'];
    this.isActive = data['isActive'];
    this.password = data['password'];
  }
}

interface TokenResponse {
  token: String;
}

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit, OnChanges {
  isEditable: Array<Boolean>;
  admintableheding: Array<String> ;
  Username: FormControl;
  Password: FormControl;
  Email: FormControl;
  SelectRole: FormControl;
  IsActive: FormControl;
  adminRegistrationForm: FormGroup;
  adminRegFormO: AdminRegFormC;
  adminRegFormAO: Array<AdminRegFormI>;
  edit_cancel: Array<String>;
  myObj: String;
  showAlert: Boolean;
  alertType: CAlert;


  constructor(private http: HttpClient) {
    this.admintableheding = new Array<String>();
    this.Username = new FormControl('', Validators.required);
    this.Password = new FormControl('', Validators.required);
    this.Email = new FormControl('', Validators.required);
    this.SelectRole = new FormControl('', Validators.required);
    this.IsActive = new FormControl('', Validators.required);
    this.alertType = new CAlert() ;
    this.showAlert = false;
  }

  ngOnInit() {
    this.alertType = new CAlert() ;
    this.showAlert = false;
    this.adminRegistrationForm = new FormGroup({
      username: this.Username,
      password: this.Password,
      email: this.Email,
      selectRole: this.SelectRole,
      isActive: this.IsActive
    });

    this.http.get(BaseUrl.baseUri + '/getAdmintableheading').subscribe(
      (data) => {
        this.admintableheding = data['AdminTableHeading'];
        console.log(data);
      },
      error => {
        console.log(error);
        throw (error);
      }
    );

    this.populateUserDetails();
  }

  ngOnChanges () {
    this.showAlert = false;
  }

  editit( itemID ) {
    this.isEditable[itemID] = !this.isEditable[itemID];
    if (this.edit_cancel[itemID] === 'Edit') {
      this.edit_cancel[itemID] = 'Cancel';
    } else {
      this.edit_cancel[itemID] = 'Edit';
    }
  }

  formSubmit(data) {
    this.adminRegFormO = new AdminRegFormC(data) ;
    console.log(data);
    this.http.post(BaseUrl.baseUri + '/register', this.adminRegFormO ).subscribe(
      (res: TokenResponse) => {
        console.log(res);
        this.populateUserDetails();
        this.alertType.type = 'success';
        this.alertType.message = 'Registration successfull';
        this.showAlert = true;
      },
      error => {
        console.log(error);
        this.populateUserDetails();
        if ( error.status() === '401' ) {
          this.alertType.type = 'danger';
          this.alertType.message = 'User already registered ';
          this.showAlert = true;
        } else {
          console.log(error);
          throw (error);
        }
      }
    );
  }

   populateUserDetails() {
    this.http.get(BaseUrl.baseUri + '/allUserDetail').subscribe(
      (resData: Array<AdminRegFormI>) => {
        this.isEditable = new Array(resData.length);
        this.edit_cancel = new Array(resData.length);
        for ( let i = 0 ; i < resData.length; i++) {
          this.isEditable[i] = true;
          this.edit_cancel[i] = 'Edit';
        }
        this.adminRegFormAO = resData;
        console.log(this.adminRegFormAO);
      },
      error => {
        console.log(error);
        throw (error);
      }
    );
   }

   saveit(myData, itemID, myValue: HTMLTableRowElement) {
     console.log(myData);
     this.adminRegFormAO[itemID]['username'] = myValue.cells.namedItem('username').textContent;
     this.adminRegFormAO[itemID]['email'] = myValue.cells.namedItem('email').textContent;
     this.adminRegFormAO[itemID]['role'] = myValue.cells.namedItem('role').textContent;
     this.adminRegFormAO[itemID]['isActive'] = myValue.cells.namedItem('isActive').textContent;


    this.http.post(BaseUrl.baseUri + '/updateUserDetail', this.adminRegFormAO[itemID]).subscribe(
      (data: Object) => {
        console.log('Data saved successfully ' + data['_id']);
        this.showAlert = true;
        this.alertType.type = 'success';
        this.alertType.message = 'Data Updated';
      },
      error => {
        this.showAlert = true;
        this.alertType.type = 'danger';
        this.alertType.message = 'Error occured while updating data at backend. Kindly check logs.';
        console.log('Error while updating data at backend');
        throw (error);
      }
    );

     this.isEditable[itemID] = true;
     this.edit_cancel[itemID] = 'Edit';
   }

   saveitBro(myForm) {
     console.log(myForm);
   }

   closeAlert() {
    this.showAlert = false;
  }

}
