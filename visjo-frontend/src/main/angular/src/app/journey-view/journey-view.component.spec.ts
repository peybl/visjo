import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyViewComponent } from './journey-view.component';

describe('JourneyViewComponent', () => {
  let component: JourneyViewComponent;
  let fixture: ComponentFixture<JourneyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JourneyViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
