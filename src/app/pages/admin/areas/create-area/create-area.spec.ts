import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateArea } from './create-area';

describe('CreateArea', () => {
  let component: CreateArea;
  let fixture: ComponentFixture<CreateArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
