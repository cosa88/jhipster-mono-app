import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CustomerGroupService } from '../service/customer-group.service';
import { ICustomerGroup, CustomerGroup } from '../customer-group.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

import { CustomerGroupUpdateComponent } from './customer-group-update.component';

describe('CustomerGroup Management Update Component', () => {
  let comp: CustomerGroupUpdateComponent;
  let fixture: ComponentFixture<CustomerGroupUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let customerGroupService: CustomerGroupService;
  let customerService: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CustomerGroupUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CustomerGroupUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomerGroupUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    customerGroupService = TestBed.inject(CustomerGroupService);
    customerService = TestBed.inject(CustomerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Customer query and add missing value', () => {
      const customerGroup: ICustomerGroup = { id: 456 };
      const customer: ICustomer = { id: 71703 };
      customerGroup.customer = customer;

      const customerCollection: ICustomer[] = [{ id: 42168 }];
      jest.spyOn(customerService, 'query').mockReturnValue(of(new HttpResponse({ body: customerCollection })));
      const additionalCustomers = [customer];
      const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
      jest.spyOn(customerService, 'addCustomerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ customerGroup });
      comp.ngOnInit();

      expect(customerService.query).toHaveBeenCalled();
      expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(customerCollection, ...additionalCustomers);
      expect(comp.customersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const customerGroup: ICustomerGroup = { id: 456 };
      const customer: ICustomer = { id: 14617 };
      customerGroup.customer = customer;

      activatedRoute.data = of({ customerGroup });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(customerGroup));
      expect(comp.customersSharedCollection).toContain(customer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CustomerGroup>>();
      const customerGroup = { id: 123 };
      jest.spyOn(customerGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customerGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customerGroup }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(customerGroupService.update).toHaveBeenCalledWith(customerGroup);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CustomerGroup>>();
      const customerGroup = new CustomerGroup();
      jest.spyOn(customerGroupService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customerGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customerGroup }));
      saveSubject.complete();

      // THEN
      expect(customerGroupService.create).toHaveBeenCalledWith(customerGroup);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CustomerGroup>>();
      const customerGroup = { id: 123 };
      jest.spyOn(customerGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customerGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(customerGroupService.update).toHaveBeenCalledWith(customerGroup);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCustomerById', () => {
      it('Should return tracked Customer primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCustomerById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
