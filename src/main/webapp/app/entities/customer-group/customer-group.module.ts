import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CustomerGroupComponent } from './list/customer-group.component';
import { CustomerGroupDetailComponent } from './detail/customer-group-detail.component';
import { CustomerGroupUpdateComponent } from './update/customer-group-update.component';
import { CustomerGroupDeleteDialogComponent } from './delete/customer-group-delete-dialog.component';
import { CustomerGroupRoutingModule } from './route/customer-group-routing.module';

@NgModule({
  imports: [SharedModule, CustomerGroupRoutingModule],
  declarations: [CustomerGroupComponent, CustomerGroupDetailComponent, CustomerGroupUpdateComponent, CustomerGroupDeleteDialogComponent],
  entryComponents: [CustomerGroupDeleteDialogComponent],
})
export class CustomerGroupModule {}
