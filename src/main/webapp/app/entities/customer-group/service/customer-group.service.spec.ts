import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICustomerGroup, CustomerGroup } from '../customer-group.model';

import { CustomerGroupService } from './customer-group.service';

describe('CustomerGroup Service', () => {
  let service: CustomerGroupService;
  let httpMock: HttpTestingController;
  let elemDefault: ICustomerGroup;
  let expectedResult: ICustomerGroup | ICustomerGroup[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CustomerGroupService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      enName: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a CustomerGroup', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new CustomerGroup()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CustomerGroup', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          enName: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CustomerGroup', () => {
      const patchObject = Object.assign(
        {
          enName: 'BBBBBB',
        },
        new CustomerGroup()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CustomerGroup', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          enName: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a CustomerGroup', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCustomerGroupToCollectionIfMissing', () => {
      it('should add a CustomerGroup to an empty array', () => {
        const customerGroup: ICustomerGroup = { id: 123 };
        expectedResult = service.addCustomerGroupToCollectionIfMissing([], customerGroup);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(customerGroup);
      });

      it('should not add a CustomerGroup to an array that contains it', () => {
        const customerGroup: ICustomerGroup = { id: 123 };
        const customerGroupCollection: ICustomerGroup[] = [
          {
            ...customerGroup,
          },
          { id: 456 },
        ];
        expectedResult = service.addCustomerGroupToCollectionIfMissing(customerGroupCollection, customerGroup);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CustomerGroup to an array that doesn't contain it", () => {
        const customerGroup: ICustomerGroup = { id: 123 };
        const customerGroupCollection: ICustomerGroup[] = [{ id: 456 }];
        expectedResult = service.addCustomerGroupToCollectionIfMissing(customerGroupCollection, customerGroup);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customerGroup);
      });

      it('should add only unique CustomerGroup to an array', () => {
        const customerGroupArray: ICustomerGroup[] = [{ id: 123 }, { id: 456 }, { id: 69576 }];
        const customerGroupCollection: ICustomerGroup[] = [{ id: 123 }];
        expectedResult = service.addCustomerGroupToCollectionIfMissing(customerGroupCollection, ...customerGroupArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const customerGroup: ICustomerGroup = { id: 123 };
        const customerGroup2: ICustomerGroup = { id: 456 };
        expectedResult = service.addCustomerGroupToCollectionIfMissing([], customerGroup, customerGroup2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customerGroup);
        expect(expectedResult).toContain(customerGroup2);
      });

      it('should accept null and undefined values', () => {
        const customerGroup: ICustomerGroup = { id: 123 };
        expectedResult = service.addCustomerGroupToCollectionIfMissing([], null, customerGroup, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(customerGroup);
      });

      it('should return initial array if no CustomerGroup is added', () => {
        const customerGroupCollection: ICustomerGroup[] = [{ id: 123 }];
        expectedResult = service.addCustomerGroupToCollectionIfMissing(customerGroupCollection, undefined, null);
        expect(expectedResult).toEqual(customerGroupCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
