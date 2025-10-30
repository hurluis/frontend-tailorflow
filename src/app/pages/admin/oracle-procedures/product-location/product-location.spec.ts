import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLocation } from './product-location';

describe('ProductLocation', () => {
  let component: ProductLocation;
  let fixture: ComponentFixture<ProductLocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLocation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
