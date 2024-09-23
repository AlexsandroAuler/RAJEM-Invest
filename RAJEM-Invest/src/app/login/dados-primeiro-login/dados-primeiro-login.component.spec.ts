import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosPrimeiroLoginComponent } from './dados-primeiro-login.component';

describe('DadosPrimeiroLoginComponent', () => {
  let component: DadosPrimeiroLoginComponent;
  let fixture: ComponentFixture<DadosPrimeiroLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DadosPrimeiroLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DadosPrimeiroLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
