import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoardingListComponent } from './hoarding-list.component';

describe('HoardingListComponent', () => {
  let component: HoardingListComponent;
  let fixture: ComponentFixture<HoardingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoardingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoardingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
