import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestReportComponent } from './harvest-report.component';

describe('HarvestReportComponent', () => {
  let component: HarvestReportComponent;
  let fixture: ComponentFixture<HarvestReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HarvestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
