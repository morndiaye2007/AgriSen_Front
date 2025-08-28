import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoixPaysComponent } from './choix-pays.component';

describe('ChoixPaysComponent', () => {
  let component: ChoixPaysComponent;
  let fixture: ComponentFixture<ChoixPaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoixPaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoixPaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
