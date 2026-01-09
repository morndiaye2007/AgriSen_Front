import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelleStatsComponent } from './parcelle-stats.component';

describe('ParcelleStatsComponent', () => {
  let component: ParcelleStatsComponent;
  let fixture: ComponentFixture<ParcelleStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelleStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelleStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
