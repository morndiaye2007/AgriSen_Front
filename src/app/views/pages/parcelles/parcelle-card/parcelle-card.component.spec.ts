import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelleCardComponent } from './parcelle-card.component';

describe('ParcelleCardComponent', () => {
  let component: ParcelleCardComponent;
  let fixture: ComponentFixture<ParcelleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelleCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
