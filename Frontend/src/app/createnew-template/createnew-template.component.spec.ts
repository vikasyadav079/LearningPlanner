import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatenewTemplateComponent } from './createnew-template.component';

describe('CreatenewTemplateComponent', () => {
  let component: CreatenewTemplateComponent;
  let fixture: ComponentFixture<CreatenewTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatenewTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatenewTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
