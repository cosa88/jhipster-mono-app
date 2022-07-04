import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CustomerGroupService } from '../service/customer-group.service';

import { CustomerGroupComponent } from './customer-group.component';

describe('CustomerGroup Management Component', () => {
  let comp: CustomerGroupComponent;
  let fixture: ComponentFixture<CustomerGroupComponent>;
  let service: CustomerGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CustomerGroupComponent],
    })
      .overrideTemplate(CustomerGroupComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomerGroupComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CustomerGroupService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.customerGroups?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
