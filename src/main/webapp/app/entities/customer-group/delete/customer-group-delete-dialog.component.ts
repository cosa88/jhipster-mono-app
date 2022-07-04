import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICustomerGroup } from '../customer-group.model';
import { CustomerGroupService } from '../service/customer-group.service';

@Component({
  templateUrl: './customer-group-delete-dialog.component.html',
})
export class CustomerGroupDeleteDialogComponent {
  customerGroup?: ICustomerGroup;

  constructor(protected customerGroupService: CustomerGroupService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.customerGroupService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
