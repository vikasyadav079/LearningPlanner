import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

export class TemplateSchemaC {
    _id: String;
    TemplateName: String;
    CategoryName: String;
    AreaName: String;
    Mentor: Array<String>;
    DocLocation: Array<String>;
    TopicHeading: String;
    DueDate: Date;
    Status: String;
    TopicDescription: String;
  }

@Injectable()
export class SelectedTopicDetailsService   {
    defaultTopicDetails = {
        _id: '',
        TemplateName: '',
        CategoryName: '',
        AreaName: '',
        Mentor: [],
        DocLocation: [],
        TopicHeading: '',
        DueDate: null,
        Status: '',
        TopicDescription: ''
    };
    currentTopicDetails = new BehaviorSubject<TemplateSchemaC>(this.defaultTopicDetails);
    currentTopicDetailsO = this.currentTopicDetails.asObservable();

    setCurrentTopic(currentTopic: TemplateSchemaC) {
        this.currentTopicDetails.next(currentTopic);
    }

    getCurrentTopic() {
        return this.currentTopicDetailsO;
    }

}
