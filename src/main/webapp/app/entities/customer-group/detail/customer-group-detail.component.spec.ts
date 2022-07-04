import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CustomerGroupDetailComponent } from './customer-group-detail.component';

describe('CustomerGroup Management Detail Component', () => {
  let comp: CustomerGroupDetailComponent;
  let fixture: ComponentFixture<CustomerGroupDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerGroupDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ customerGroup: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CustomerGroupDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CustomerGroupDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load customerGroup on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.customerGroup).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
