import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CustomerGroupComponent } from '../list/customer-group.component';
import { CustomerGroupDetailComponent } from '../detail/customer-group-detail.component';
import { CustomerGroupUpdateComponent } from '../update/customer-group-update.component';
import { CustomerGroupRoutingResolveService } from './customer-group-routing-resolve.service';

const customerGroupRoute: Routes = [
  {
    path: '',
    component: CustomerGroupComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CustomerGroupDetailComponent,
    resolve: {
      customerGroup: CustomerGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CustomerGroupUpdateComponent,
    resolve: {
      customerGroup: CustomerGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CustomerGroupUpdateComponent,
    resolve: {
      customerGroup: CustomerGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(customerGroupRoute)],
  exports: [RouterModule],
})
export class CustomerGroupRoutingModule {}
