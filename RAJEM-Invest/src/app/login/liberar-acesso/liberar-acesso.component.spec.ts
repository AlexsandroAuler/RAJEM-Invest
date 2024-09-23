import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberarAcessoComponent } from './liberar-acesso.component';

describe('LiberarAcessoComponent', () => {
  let component: LiberarAcessoComponent;
  let fixture: ComponentFixture<LiberarAcessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiberarAcessoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiberarAcessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
