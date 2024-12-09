import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarCarteiraComponent } from './editar-carteira.component';

describe('EditarCarteiraComponent', () => {
  let component: EditarCarteiraComponent;
  let fixture: ComponentFixture<EditarCarteiraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarCarteiraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCarteiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
