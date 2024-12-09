import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAtivosComponent } from './list-ativos.component';

describe('ListAtivosComponent', () => {
  let component: ListAtivosComponent;
  let fixture: ComponentFixture<ListAtivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAtivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAtivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
