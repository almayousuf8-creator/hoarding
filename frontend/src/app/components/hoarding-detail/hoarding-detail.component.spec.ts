import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoardingDetailComponent } from './hoarding-detail.component';

describe('HoardingDetailComponent', () => {
  let component: HoardingDetailComponent;
  let fixture: ComponentFixture<HoardingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoardingDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoardingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
