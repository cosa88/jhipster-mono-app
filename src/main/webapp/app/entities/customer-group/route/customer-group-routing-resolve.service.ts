import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICustomerGroup, CustomerGroup } from '../customer-group.model';
import { CustomerGroupService } from '../service/customer-group.service';

@Injectable({ providedIn: 'root' })
export class CustomerGroupRoutingResolveService implements Resolve<ICustomerGroup> {
  constructor(protected service: CustomerGroupService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICustomerGroup> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((customerGroup: HttpResponse<CustomerGroup>) => {
          if (customerGroup.body) {
            return of(customerGroup.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CustomerGroup());
  }
}
