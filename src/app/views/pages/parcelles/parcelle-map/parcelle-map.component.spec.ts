import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelleMapComponent } from './parcelle-map.component';

describe('ParcelleMapComponent', () => {
  let component: ParcelleMapComponent;
  let fixture: ComponentFixture<ParcelleMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelleMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
