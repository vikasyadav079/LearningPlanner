import { BaseUrl } from './../authentication-service/authentication.service';
import { HttpClient , HttpParams} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common' ;

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


class HistoryDetailsSchema {
  seqno: number;
  submitter: String;
  SubmittedDate: Date;
  Notes: String;
}

class TemplateUserCategoryDetails {
  CategoryName: String;
  AreaName: String;
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

class TopicDetailsSchemaC {
  TopicHeading: String;
  Mentors: Array<String>;
}

class AreaDetailsSchemaC {
  AreaName: String;
  TopicDetailsSchemaA: Array<TopicDetailsSchemaC>;
}

class CategoryDetailsSchemaC {
  CategoryName: String;
  AreaDetailsSchemaA: Array<AreaDetailsSchemaC>;
}

class AssigneeListSchema {
  _id: string;
  AssigneeName: string;
}

@Component({
  selector: 'app-newtemplate',
  templateUrl: './newtemplate.component.html',
  styleUrls: ['./newtemplate.component.css']
})
export class NewtemplateComponent implements OnInit {
  queryparams ;
  templateName: String;
  programName: Array<String>;
  ownerGroup: String;
  creater: String;
  owner: Array<String>;
  templateDescription: String;

  categoryDetailsSchemaA: Array<CategoryDetailsSchemaC>;

  categoryName: String;
  areaName: String;
  topicHeading: String;

  categoryNameA: Array<String>;
  areaNameA: Array<String>;
  topicHeadingA: Array<String>;
  mentorsA: Array<String>;

  assigneeList: Array<String>;
  createdAt: string;



  constructor(private http: HttpClient, private activeRoute: ActivatedRoute, private router: Router, private datePipe: DatePipe) {
    this.programName = new Array();
    this.categoryDetailsSchemaA = new Array<CategoryDetailsSchemaC>();
    this.categoryNameA = new Array();
    this.areaNameA = new Array();
    this.topicHeadingA = new Array();
    this.mentorsA = new Array();
    this.assigneeList = new Array();
  }

  ngOnInit() {
    this.queryparams = this.activeRoute.snapshot.queryParams;
    console.log(this.queryparams);
    this.templateName = this.queryparams['templatename'];

    const params = new HttpParams().set('TemplateName', this.queryparams['templatename']);

    // jsons/templateAssigneeDetails_1.json
    // this.http.get('./jsons/templateAssigneeDetails_1.json').subscribe(
    this.http.get(BaseUrl.baseUri + '/getTemplateDetailsbyName', { params }).subscribe(
      (data: TemplateDetailsI) => {
        console.log(data);
        data.TemplateDetails.forEach(td => {
          const tempCategoryDetailsSchemaO = new CategoryDetailsSchemaC();
          tempCategoryDetailsSchemaO.CategoryName = td.CategoryName;
          tempCategoryDetailsSchemaO.AreaDetailsSchemaA = new Array();
          td.CategoryDetails.forEach(cd => {
            const tempAreaDetailsSchemaO = new AreaDetailsSchemaC();
            tempAreaDetailsSchemaO.AreaName = cd.AreaName;
            tempAreaDetailsSchemaO.TopicDetailsSchemaA = new Array<TopicDetailsSchemaC>();
            cd.AreaDetails.forEach(ad => {
              const topicDetailsO = new TopicDetailsSchemaC();
              topicDetailsO.TopicHeading = ad.TopicHeading;
              topicDetailsO.Mentors = ad.Mentor;
              tempAreaDetailsSchemaO.TopicDetailsSchemaA.push(topicDetailsO);
            });
            tempCategoryDetailsSchemaO.AreaDetailsSchemaA.push(tempAreaDetailsSchemaO);
          });
          this.categoryDetailsSchemaA.push(tempCategoryDetailsSchemaO);
        });
        console.log(this.categoryDetailsSchemaA);

          this.categoryName = this.categoryDetailsSchemaA[0].CategoryName;
          this.areaName = this.categoryDetailsSchemaA[0].AreaDetailsSchemaA[0].AreaName;
          this.topicHeading = this.categoryDetailsSchemaA[0].AreaDetailsSchemaA[0].TopicDetailsSchemaA[0].TopicHeading;

          this.categoryDetailsSchemaA.forEach(cdS => {
            this.categoryNameA.push(cdS.CategoryName);
          });

          this.categoryDetailsSchemaA[0].AreaDetailsSchemaA.forEach(adS => {
              this.areaNameA.push(adS.AreaName);
          });

          this.categoryDetailsSchemaA[0].AreaDetailsSchemaA[0].TopicDetailsSchemaA.forEach(tdS => {
            this.topicHeadingA.push(tdS.TopicHeading);
            this.mentorsA = tdS.Mentors;
          });
      },
      error => {
        console.log(error);
        throw (error);
      }
    );

    this.http.get(BaseUrl.baseUri + '/templateMetadata', {params}).subscribe(
      (data: TemplateMetaDataSchema) => {
        console.log(data);
        this.programName = data.ProgramName;
        this.ownerGroup = data.OwnerGroup;
        this.creater = data.Creater;
        this.owner = data.Owner;
        this.createdAt = this.datePipe.transform(data.CreatedAt, 'yyyy-MM-dd');
        this.templateDescription = data.TemplateDescription;
      },
      error => {
        console.log(error);
        throw (error);
      }
    );

    this.http.get(BaseUrl.baseUri + '/getAssigneebyTemplateName', {params}).subscribe(
      ( data: Array<AssigneeListSchema>) =>  {
        console.log(data);
        data.forEach(d => {
          console.log(d.AssigneeName);
          this.assigneeList.push(d.AssigneeName);
        });
        console.log(this.assigneeList);
      },
      error => {
        console.log(error);
        throw (error);
      }
    );
  }

  categoryClicked (categoryItem , i) {
    console.log(categoryItem + ' ' + i);
    this.categoryName = this.categoryDetailsSchemaA[i].CategoryName;
    this.areaName = this.categoryDetailsSchemaA[i].AreaDetailsSchemaA[0].AreaName;
    this.topicHeading = this.categoryDetailsSchemaA[i].AreaDetailsSchemaA[0].TopicDetailsSchemaA[0].TopicHeading;

    this.categoryNameA = [];
    this.categoryDetailsSchemaA.forEach(cdS => {
      this.categoryNameA.push(cdS.CategoryName);
    });

    this.areaNameA = [];
    this.categoryDetailsSchemaA[i].AreaDetailsSchemaA.forEach(adS => {
      this.areaNameA.push(adS.AreaName);
    });

    this.topicHeadingA = [];
    this.categoryDetailsSchemaA[i].AreaDetailsSchemaA[0].TopicDetailsSchemaA.forEach(tdS => {
      this.topicHeadingA.push(tdS.TopicHeading);
      this.mentorsA = tdS.Mentors;
    });
  }


  areaClicked ( areaItem , i) {
    let categoryIndex = -1;
    this.categoryDetailsSchemaA.forEach(cdS => {
      if (cdS.CategoryName === this.categoryName) {
          categoryIndex = this.categoryDetailsSchemaA.indexOf(cdS);
      }
    });

    this.areaName = this.categoryDetailsSchemaA[categoryIndex].AreaDetailsSchemaA[i].AreaName;
    this.topicHeading = this.categoryDetailsSchemaA[categoryIndex].AreaDetailsSchemaA[i].TopicDetailsSchemaA[0].TopicHeading;
    this.topicHeadingA = [];
    this.categoryDetailsSchemaA[categoryIndex].AreaDetailsSchemaA[i].TopicDetailsSchemaA.forEach(tdS => {
      this.topicHeadingA.push(tdS.TopicHeading);
      this.mentorsA = tdS.Mentors;
    });
  }

  topicheadingClicked( topicheading, i) {
    // console.log(topicheading + ' ' + i);
    // nothing is required here...!!!
  }

  backToSummaryPage() {
    this.router.navigate(['/subAdminManagement']);
  }

}
