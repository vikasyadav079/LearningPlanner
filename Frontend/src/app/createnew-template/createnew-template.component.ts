import { HttpClient } from '@angular/common/http';
import { AuthenticationService, BaseUrl } from './../authentication-service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

class CAlert {
  type: string;
  message: string;
}


interface OwnerGroupSchemaI {
  OwnerGroupList: Array<String>;
}

interface AreaDetailsI {
  mentor: Array<String>;
  topicHeading: String;
  topicDescription: String;
  docLocation: Array<String>;
}

class AreaDetailsC implements  AreaDetailsI {
  mentor: Array<String>;
  topicHeading: String;
  topicDescription: String;
  docLocation: Array<String>;

  constructor () {
    this.mentor = [];
    this.topicHeading = '';
    this.topicDescription = '';
    this.docLocation = [];
  }
}

interface AreaSchemaI {
  areaName: String;
  areaDetails: Array<AreaDetailsI>;
}

class AreaSchemaC implements  AreaSchemaI {
  areaName: String;
  areaDetails: Array<AreaDetailsI>;
  constructor () {
    this.areaName = '';
    this.areaDetails = [];
  }
}

interface CategorySchemaI {
  categoryName: String;
  categoryDetails: Array<AreaSchemaI>;
}

class CategorySchemaC implements  CategorySchemaI {
  categoryName: String;
  categoryDetails: Array<AreaSchemaI>;
  constructor () {
    this.categoryName = '';
    this.categoryDetails = [];
  }
}

interface TemplateSchemaI {
  templateName: String;
  program: Array<String>;
  ownerGroup: String ;
  owner: Array<String>;
  category: Array<CategorySchemaI>;
  templateDescription?: String;
  Status: String;
}

class TemplateSchemaC implements TemplateSchemaI {
  templateName: String;
  program: Array<String>;
  ownerGroup: String ;
  owner: Array<String>;
  category: Array<CategorySchemaI>;
  templateDescription?: String;
  Status: String;
  constructor () {
    this.templateName = '';
    this.program = [];
    this.ownerGroup = '';
    this.owner = [];
    this.templateDescription = '';
    this.Status = '';
  }
}

class SaveAndSubmitTemplate {
  TemplateName: String;
  ProgramName: Array<String>;
  OwnerGroup: String;
  Owner: Array<String>;
  Creater: String;
  TemplateDescription: String;

  constructor () {
    this.TemplateName = '';
    this.ProgramName = [];
    this.OwnerGroup = '';
    this.Owner = [];
    this.Creater = '';
    this.TemplateDescription = '';
  }
}

class SaveAndSubmitCategoryTemplate {
  TemplateName: String;
  TemplateDetails: Array<CategorySchemaI>;

  constructor () {
    this.TemplateName = '';
  }
}

@Component({
  selector: 'app-createnew-template',
  templateUrl: './createnew-template.component.html',
  styleUrls: ['./createnew-template.component.css']
})
export class CreatenewTemplateComponent implements OnInit {

  currentTemplateO: TemplateSchemaC ;
  areaSchemaOA: Array<AreaSchemaI> ;
  areaDetailsOA: Array<AreaDetailsI>;
  areaDetailsO: AreaDetailsI;
  currentMentorArray: Array<String>;
  currentDocLocationArray: Array<String>;
  docLocationO: String;
  ownerGroupList: Array<String>;

  isCurrentCategorySelected: Boolean = false;
  isCurrentAreaSelected: Boolean = false;

  ownerO: String;
  categoryO: String;
  areaO: String;
  programO: String;

  topicHeadingO: String;
  topicDescriptionO: String;

  mentorO: String;

  currentUser: String;

  showAlert: Boolean;
  alertType: CAlert;

  constructor(
    private authenticationService: AuthenticationService,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.showAlert = false;
    this.alertType = new CAlert();
    this.ownerGroupList = new Array();
    this.docLocationO = '';
    this.currentDocLocationArray = new Array();
    this.currentMentorArray = new Array();

    this.currentUser = this.authenticationService.getUserDetails().username;

    this.currentTemplateO = new TemplateSchemaC();
    this.currentTemplateO.templateName = '';
    this.currentTemplateO.ownerGroup = '';

    this.ownerO = '';
    this.currentTemplateO.owner = [];

    this.programO = '';
    this.currentTemplateO.program = [];

    this.mentorO = '';


    this.categoryO = '';
    this.currentTemplateO.category = [];

    this.areaO = '';
    this.areaSchemaOA = [];
    this.topicHeadingO = '';

    this.currentTemplateO.templateDescription = '';
  }

  ngOnInit() {
    this.showAlert = false;
    this.alertType = new CAlert();
    this.httpClient.get('./jsons/ownerGroupList.json').subscribe(
      (data: OwnerGroupSchemaI) => {
        this.ownerGroupList = data.OwnerGroupList;
      },
      error => {
        console.log(error);
        throw (error);
      }
    );
  }

  addProgram() {
    // check if user already existing
    if (this.currentTemplateO.program.indexOf(this.programO) >= 0) {
      // program already exist on program array.

    } else {
      this.currentTemplateO.program.splice(0, 0, this.programO);
      this.programO = '';
    }
  }

  currentProgram(programName: String) {
    this.programO = programName;
  }

  deleteProgram() {
    if (this.programO.length < 0) {
      // do nothing as nothing to delete
    } else {
      const index = this.currentTemplateO.program.indexOf(this.programO) ;
      if ( index >= 0 ) {
        this.currentTemplateO.program.splice(index, 1);
        this.programO = '';
      }
    }
  }

  addMentor() {
    // check if user already existing
    if (this.currentMentorArray.indexOf(this.mentorO) >= 0) {
      // program already exist on program array.

    } else {
      this.currentMentorArray.splice(0, 0, this.mentorO);
      this.mentorO = '';
    }
  }

  currentMentor(mentorName: String) {
    this.mentorO = mentorName;
  }

  deleteMentor() {
    if (this.mentorO.length < 0) {
      // do nothing as nothing to delete
    } else {
      const index = this.currentMentorArray.indexOf(this.mentorO) ;
      if ( index >= 0 ) {
        this.currentMentorArray.splice(index, 1);
        this.mentorO = '';
      }
    }
  }

  addDocLocation() {
    // check if user already existing
    if (this.currentDocLocationArray.indexOf(this.docLocationO) >= 0) {
      // program already exist on program array.

    } else {
      this.currentDocLocationArray.splice(0, 0, this.docLocationO);
      this.docLocationO = '';
    }
  }

  currentDocLocation(docLocationName: String) {
    this.docLocationO = docLocationName;
  }

  deleteDocLocation() {
    if (this.docLocationO.length < 0) {
      // do nothing as nothing to delete
    } else {
      const index = this.currentDocLocationArray.indexOf(this.docLocationO) ;
      if ( index >= 0 ) {
        this.currentDocLocationArray.splice(index, 1);
        this.docLocationO = '';
      }
    }
  }

  addOwner() {
    // check if user already existing
    if (this.currentTemplateO.owner.indexOf(this.ownerO) >= 0) {
      // owner already exist on owner array.

    } else {
      this.currentTemplateO.owner.splice(0, 0, this.ownerO);
      this.ownerO = '';
    }
  }

  currentOwner(ownerName: String) {
    this.ownerO = ownerName;
  }

  deleteOwner() {
    if (this.ownerO.length < 0) {
      // do nothing as nothing to delete
    } else {
      const index = this.currentTemplateO.owner.indexOf(this.ownerO) ;
      if ( index >= 0 ) {
        this.currentTemplateO.owner.splice(index, 1);
        this.ownerO = '';
      }
    }
  }

  // this validation can be used in savedandsubmit method for validation purpose
  checkValid(): Boolean {
     /* if ( this.currentTemplateO.templateName === '' || this.programO === '' ||
       this.currentTemplateO.ownerGroup === '' || this.ownerO === '' || this.categoryO === '' || this.areaO === '' ||
       this.topicHeadingO === '' || this.topicDescriptionO === '' || this.mentorO || this.docLocationO === '' ||
       this.currentTemplateO.templateDescription === '') {
        return false;
       } */
       let isValid = false;

       if ( this.currentTemplateO.templateName && (this.currentTemplateO.program.length > 0) &&
        this.currentTemplateO.ownerGroup && (this.currentTemplateO.owner.length > 0) &&
        this.currentTemplateO.templateDescription ) {

          if (this.currentTemplateO.category.length > 0) {
            this.currentTemplateO.category.forEach(c => {
              if (c.categoryDetails.length > 0 ) {
                c.categoryDetails.forEach(cd => {
                  if (cd.areaDetails.length > 0) {
                    cd.areaDetails.forEach(ad => {
                      if (ad.topicHeading && ad.topicDescription && ad.mentor.length > 0) {
                        isValid = true;
                      } else {
                        isValid = false;
                      }
                    });
                  } else {
                    isValid = false;
                  }
                });
              } else {
                isValid = false;
              }
            });
          } else {
            isValid = false;
          }
        }
    return isValid;
  }

  checkValid_1(): Boolean {
    /* if ( this.currentTemplateO.templateName === '' || this.programO === '' ||
      this.currentTemplateO.ownerGroup === '' || this.ownerO === '' || this.categoryO === '' || this.areaO === '' ||
      this.topicHeadingO === '' || this.topicDescriptionO === '' || this.mentorO || this.docLocationO === '' ||
      this.currentTemplateO.templateDescription === '') {
       return false;
      } */

      if ( this.currentTemplateO.templateName && (this.currentTemplateO.program.length > 0) &&
       this.currentTemplateO.ownerGroup && (this.currentTemplateO.owner.length > 0) &&
       this.currentTemplateO.templateDescription && this.categoryO && this.areaO && this.topicHeadingO &&
       this.topicDescriptionO && (this.currentMentorArray.length > 0) && (this.currentDocLocationArray.length > 0)) {
        return true;
      }
   return false;
  }

  saveToCategory() {
    // check if category name , area name ,topic heading , topic desc  mentor ,doc name is filed
    // if yes then execute below code
    if (this.checkValid_1()) {
      const areadetailso  = new AreaDetailsC() ;
      areadetailso.topicHeading = this.topicHeadingO;
      areadetailso.topicDescription = this.topicDescriptionO;
      areadetailso.mentor = this.currentMentorArray;
      areadetailso.docLocation = this.currentDocLocationArray;
      // add to existin category or create new
      const currentCategoryName = this.categoryO;
      const currentAreaName = this.areaO;
      let iscategoryfound = false;
      this.currentTemplateO.category.forEach(
        c => {
          if (c.categoryName === currentCategoryName) {
            iscategoryfound = true;
            let isareanamefound = false;
            c.categoryDetails.forEach(cd => {
              if (cd.areaName === currentAreaName) {
                isareanamefound = true;
                let topicNameFound = false;
                cd.areaDetails.forEach(ad => {
                  if ( ad.topicHeading === areadetailso.topicHeading) {
                    topicNameFound = true;
                    const index = cd.areaDetails.indexOf(ad);
                    cd.areaDetails[index] = areadetailso;
                    cd.areaDetails.push(areadetailso);
                    isareanamefound = true;
                  }
                });
                if (!topicNameFound) {
                  cd.areaDetails.push(areadetailso);
                }
              }
            });
            if ( !isareanamefound ) {
              const areaschemao = new AreaSchemaC();
              areaschemao.areaName = currentAreaName;
              areaschemao.areaDetails = [];
              areaschemao.areaDetails.push(areadetailso);
              c.categoryDetails.push(areaschemao);
            }
          }
        }
      );
      if ( !iscategoryfound ) {
        const areaschemao = new AreaSchemaC();
        areaschemao.areaName = currentAreaName;
        areaschemao.areaDetails = [];
        areaschemao.areaDetails.push(areadetailso);
        const categoryschemao = new CategorySchemaC();
        categoryschemao.categoryName = currentCategoryName;
        categoryschemao.categoryDetails = [];
        categoryschemao.categoryDetails.push(areaschemao);
        this.currentTemplateO.category.push(categoryschemao);
      }
      console.log(this.currentTemplateO);
      this.categoryO = '';
      this.areaO = '';
      this.mentorO = '';
      this.topicHeadingO = '';
      this.topicDescriptionO = '';
      this.currentDocLocationArray = [];
      this.currentMentorArray = [];
      this.docLocationO = '';
      this.isCurrentCategorySelected = false;
      this.isCurrentAreaSelected = false;
    } else {
      this.showAlert = true;
      this.alertType.type = 'danger';
      this.alertType.message = 'Kindly fill all the details ';
    }
  }

  selectCurrentCategory(currentCategory: CategorySchemaI) {
    const currentCategoryName = currentCategory.categoryName;
    this.isCurrentCategorySelected = false;
    let currentCategoryIndex = -1;
    const categoryList =  this.currentTemplateO.category;
    this.currentTemplateO.category.forEach(c => {
      if (c.categoryName === currentCategoryName) {
        currentCategoryIndex = categoryList.indexOf(c);
      }
    });
    if ( currentCategoryIndex >= 0) {
      this.categoryO = currentCategory.categoryName;
      this.areaSchemaOA = this.currentTemplateO.category[currentCategoryIndex].categoryDetails;
      this.isCurrentCategorySelected = true;
    } else {
      this.categoryO = '';
      this.isCurrentCategorySelected = false;
      this.areaDetailsOA = [];
      this.mentorO = '';
      this.topicHeadingO = '';
      this.topicDescriptionO = '';
    }
  }

  selectCurrentArea(currentArea: AreaSchemaI) {
    console.log(currentArea);
    let currentAreaIndex = -1;
    if (this.isCurrentCategorySelected ) {
      this.currentTemplateO.category.forEach(c => {
        if (c.categoryName === this.categoryO) {
          currentAreaIndex = c.categoryDetails.indexOf(currentArea);
        }
      });
      if (currentAreaIndex >= 0) {
        this.areaO = currentArea.areaName;
        this.areaDetailsOA = currentArea.areaDetails;
        this.isCurrentAreaSelected = true;
      }
    } else {
      this.isCurrentAreaSelected = false;
      this.mentorO = '';
      this.topicHeadingO = '';
      this.topicDescriptionO = '';
      this.areaO = currentArea.areaName;
      this.isCurrentAreaSelected = false;
    }
  }

  selectTopicHeading(currentTopic: AreaDetailsC) {
    let currentCategoryIndex = -1;
    let currentAreaIndex = -1 ;

   const categoryList = this.currentTemplateO.category;
    categoryList.forEach (c => {
      if (c.categoryName === this.categoryO) {
        currentCategoryIndex = categoryList.indexOf(c);
        c.categoryDetails.forEach(cd => {
          if (cd.areaName === this.areaO) {
            currentAreaIndex = c.categoryDetails.indexOf(cd);
          }
        }) ;
      }
    });
    if (currentTopic.topicHeading.length > 0 ) {
      this.areaO = this.currentTemplateO.category[currentCategoryIndex].categoryDetails[currentAreaIndex].areaName;
      this.currentMentorArray = currentTopic.mentor;
      this.topicHeadingO = currentTopic.topicHeading;
      this.topicDescriptionO = currentTopic.topicDescription;
      this.currentDocLocationArray = currentTopic.docLocation;
      this.categoryO = this.currentTemplateO.category[currentCategoryIndex].categoryName;
    } else {
      this.areaO = this.currentTemplateO.category[currentCategoryIndex].categoryDetails[currentAreaIndex].areaName;
      this.mentorO = '';
      this.currentMentorArray = [];
      this.currentDocLocationArray = [];
      this.topicHeadingO = '';
      this.topicDescriptionO = '';
      this.categoryO = this.currentTemplateO.category[currentCategoryIndex].categoryName;
    }
  }

  saveandsubmit() {
    // check if this details are filled. if valid then send response
    const saveAndSubmitO = new SaveAndSubmitTemplate();
    saveAndSubmitO.TemplateName = this.currentTemplateO.templateName;
    saveAndSubmitO.ProgramName = this.currentTemplateO.program;
    saveAndSubmitO.OwnerGroup = this.currentTemplateO.ownerGroup;
    saveAndSubmitO.Owner = this.currentTemplateO.owner;
    saveAndSubmitO.Creater = this.currentUser;
    saveAndSubmitO.TemplateDescription = this.currentTemplateO.templateDescription;

    this.httpClient.post(BaseUrl.baseUri + '/savetemplatemetadata', saveAndSubmitO).subscribe(
      (data: String) => {
        console.log('Data Saved successfully ' + data);
        this.showAlert = true;
        this.alertType.type = 'success' ;
        this.alertType.message = 'Data saved successfully ';
        this.router.navigate(['./subAdminManagement']);
      },
      error => {
        console.log(error);
        throw (error);
      }
    );

    const saveAndSubmitCategoryO = new SaveAndSubmitCategoryTemplate();
    saveAndSubmitCategoryO.TemplateName = this.currentTemplateO.templateName;
    saveAndSubmitCategoryO.TemplateDetails = new Array();
    this.currentTemplateO.category.forEach(c => {
      saveAndSubmitCategoryO.TemplateDetails.push(c);
    });
    console.log(saveAndSubmitCategoryO);

    this.httpClient.post(BaseUrl.baseUri + '/templateSaveContents', saveAndSubmitCategoryO).subscribe(
      (data: String) => console.log(data),
      error => {
        console.log(error);
        throw (error);
      }
    );
  }

  resetCategory () {
    this.currentDocLocationArray = [];
    this.docLocationO = '';
    this.currentMentorArray = [];
    this.mentorO = '';
    this.topicHeadingO = '';
    this.topicDescriptionO = '';
    this.areaO = '';
    this.categoryO = '';
  }

  closeAlert() {
    this.showAlert = false;
  }

}
