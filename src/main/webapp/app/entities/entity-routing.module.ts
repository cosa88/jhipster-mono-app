import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'customer',
        data: { pageTitle: 'myApp.customer.home.title' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'customer-group',
        data: { pageTitle: 'myApp.customerGroup.home.title' },
        loadChildren: () => import('./customer-group/customer-group.module').then(m => m.CustomerGroupModule),
      },
      {
        path: 'project',
        data: { pageTitle: 'myApp.project.home.title' },
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
