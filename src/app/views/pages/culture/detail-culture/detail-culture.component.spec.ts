import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCultureComponent } from './detail-culture.component';

describe('DetailCultureComponent', () => {
  let component: DetailCultureComponent;
  let fixture: ComponentFixture<DetailCultureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCultureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailCultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
