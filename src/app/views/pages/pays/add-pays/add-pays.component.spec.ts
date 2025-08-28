import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaysComponent } from './add-pays.component';

describe('AddPaysComponent', () => {
  let component: AddPaysComponent;
  let fixture: ComponentFixture<AddPaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
