import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';



export class TopicDetailsComSchema {
    CategoryName: String;
    AreaName: String;
    TopicName: String;
    AssigneeName: String;
    TemplateName: String;
}


@Injectable()
export class TopicDetailsComService {
    defaultTopicDetailsComO = {
        CategoryName: '',
        AreaName: '',
        TopicName: '',
        AssigneeName: '',
        TemplateName: ''
    };

    topicDetailsComO = new BehaviorSubject<TopicDetailsComSchema>(this.defaultTopicDetailsComO);
    topicDetailsComObs = this.topicDetailsComO.asObservable();

    setNext(value: TopicDetailsComSchema) {
        this.topicDetailsComO.next(value);
    }

    getDetails(): Observable<TopicDetailsComSchema> {
        return this.topicDetailsComObs;
    }
}
