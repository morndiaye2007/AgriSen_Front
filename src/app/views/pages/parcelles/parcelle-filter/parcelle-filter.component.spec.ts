import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelleFilterComponent } from './parcelle-filter.component';

describe('ParcelleFilterComponent', () => {
  let component: ParcelleFilterComponent;
  let fixture: ComponentFixture<ParcelleFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelleFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelleFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
