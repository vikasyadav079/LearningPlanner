import { HeadingTabAuthService } from './shared/headingtabauth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalErrorHandlerService } from './errorhandlers/GlobalErrorHandlerService';
import { ErrorHandler, HostListener } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HeadingComponent } from './public/heading/heading.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './public/footer/footer.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { AuthenticationService } from './authentication-service/authentication.service';
import { AuthGuardService } from './authentication-service/auth-guard.service';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './loader/loader.service';
import { FormsModule } from '@angular/forms';
import { TopicdetailsComponent } from './topicdetails/topicdetails.component';
import { NewtemplateComponent } from './newtemplate/newtemplate.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageTemplateComponent } from './manage-template/manage-template.component';
import { CreatenewTemplateComponent } from './createnew-template/createnew-template.component';
import { GlobalErrorComponent } from './global-error/global-error.component';
import { SelectedTopicDetailsService } from './home/selectedtopicdetails.service';
import { TopicDetailsComService } from './home/topicdetailscom.service';
import { AssignTemplateComponent } from './assign-template/assign-template.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { AlertMessageService } from './alert-message/alert-message.service';
import { ModalComponent } from './modal/modal.component';
import { ServerErrorsInterceptorService } from './errorhandlers/server-errors-interceptor.service';
import { ErrorsServiceService } from './errorhandlers/errors-service.service';
import { ErrorViewMangeService } from './errorhandlers/error-view-mange.service';
import { TestErrorComponent } from './test-error/test-error.component';
import { EditTemplateComponent } from './edit-template/edit-template.component';



const appRoutes: Routes = [
  { path: '', redirectTo: '/aboutus', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'registration', component: RegisterComponent},
  { path: 'aboutus', component: AboutusComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'details', component: TopicdetailsComponent, canActivate: [AuthGuardService] },
  { path: 'logout', redirectTo: '/aboutus', pathMatch: 'full'},
  { path: 'newtemplate', component: NewtemplateComponent },
  { path: 'createNewtemplate', component: CreatenewTemplateComponent },
  { path: 'adminManagement', component: ManageUserComponent, canActivate: [AuthGuardService]},
  { path: 'subAdminManagement', component: ManageTemplateComponent, canActivate: [AuthGuardService]},
  { path: 'errorPage', component: GlobalErrorComponent},
  { path: 'assignTemplate', component: AssignTemplateComponent},
  { path: 'editTemplate', component: EditTemplateComponent},
  // { path: '**', component: GlobalErrorComponent, data: {error: 404}}
];



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeadingComponent,
    HomeComponent,
    FooterComponent,
    AboutusComponent,
    LoaderComponent,
    TopicdetailsComponent,
    NewtemplateComponent,
    ManageUserComponent,
    ManageTemplateComponent,
    CreatenewTemplateComponent,
    GlobalErrorComponent,
    AssignTemplateComponent,
    AlertMessageComponent,
    ModalComponent,
    TestErrorComponent,
    EditTemplateComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing : true }
    ),
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [
    ErrorsServiceService,
    ServerErrorsInterceptorService,
    AuthenticationService,
    AuthGuardService,
    LoaderService,
    HeadingTabAuthService,
    SelectedTopicDetailsService,
    AlertMessageComponent,
    AlertMessageService,
    TopicDetailsComService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
    /* {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptorService ,
      multi: true,
    }, */
    ErrorViewMangeService,
    GlobalErrorHandlerService

  ],
  entryComponents: [ModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
