import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoboxResultsComponent } from './infobox-results.component';

describe('InfoboxResultsComponent', () => {
  let component: InfoboxResultsComponent;
  let fixture: ComponentFixture<InfoboxResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoboxResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoboxResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
