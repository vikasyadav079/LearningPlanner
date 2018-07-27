import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LoaderService {
  state: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  constructor() { }

  display(value: Boolean) {
    this.state.next(value);
  }

}
