import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICustomerGroup, getCustomerGroupIdentifier } from '../customer-group.model';

export type EntityResponseType = HttpResponse<ICustomerGroup>;
export type EntityArrayResponseType = HttpResponse<ICustomerGroup[]>;

@Injectable({ providedIn: 'root' })
export class CustomerGroupService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/customer-groups');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(customerGroup: ICustomerGroup): Observable<EntityResponseType> {
    return this.http.post<ICustomerGroup>(this.resourceUrl, customerGroup, { observe: 'response' });
  }

  update(customerGroup: ICustomerGroup): Observable<EntityResponseType> {
    return this.http.put<ICustomerGroup>(`${this.resourceUrl}/${getCustomerGroupIdentifier(customerGroup) as number}`, customerGroup, {
      observe: 'response',
    });
  }

  partialUpdate(customerGroup: ICustomerGroup): Observable<EntityResponseType> {
    return this.http.patch<ICustomerGroup>(`${this.resourceUrl}/${getCustomerGroupIdentifier(customerGroup) as number}`, customerGroup, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICustomerGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICustomerGroup[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCustomerGroupToCollectionIfMissing(
    customerGroupCollection: ICustomerGroup[],
    ...customerGroupsToCheck: (ICustomerGroup | null | undefined)[]
  ): ICustomerGroup[] {
    const customerGroups: ICustomerGroup[] = customerGroupsToCheck.filter(isPresent);
    if (customerGroups.length > 0) {
      const customerGroupCollectionIdentifiers = customerGroupCollection.map(
        customerGroupItem => getCustomerGroupIdentifier(customerGroupItem)!
      );
      const customerGroupsToAdd = customerGroups.filter(customerGroupItem => {
        const customerGroupIdentifier = getCustomerGroupIdentifier(customerGroupItem);
        if (customerGroupIdentifier == null || customerGroupCollectionIdentifiers.includes(customerGroupIdentifier)) {
          return false;
        }
        customerGroupCollectionIdentifiers.push(customerGroupIdentifier);
        return true;
      });
      return [...customerGroupsToAdd, ...customerGroupCollection];
    }
    return customerGroupCollection;
  }
}
