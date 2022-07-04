import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ICustomerGroup, CustomerGroup } from '../customer-group.model';
import { CustomerGroupService } from '../service/customer-group.service';

import { CustomerGroupRoutingResolveService } from './customer-group-routing-resolve.service';

describe('CustomerGroup routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: CustomerGroupRoutingResolveService;
  let service: CustomerGroupService;
  let resultCustomerGroup: ICustomerGroup | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(CustomerGroupRoutingResolveService);
    service = TestBed.inject(CustomerGroupService);
    resultCustomerGroup = undefined;
  });

  describe('resolve', () => {
    it('should return ICustomerGroup returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCustomerGroup = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCustomerGroup).toEqual({ id: 123 });
    });

    it('should return new ICustomerGroup if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCustomerGroup = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultCustomerGroup).toEqual(new CustomerGroup());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CustomerGroup })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCustomerGroup = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCustomerGroup).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
