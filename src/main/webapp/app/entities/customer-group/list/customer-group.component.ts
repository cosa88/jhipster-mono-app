import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICustomerGroup } from '../customer-group.model';
import { CustomerGroupService } from '../service/customer-group.service';
import { CustomerGroupDeleteDialogComponent } from '../delete/customer-group-delete-dialog.component';

@Component({
  selector: 'jhi-customer-group',
  templateUrl: './customer-group.component.html',
})
export class CustomerGroupComponent implements OnInit {
  customerGroups?: ICustomerGroup[];
  isLoading = false;

  constructor(protected customerGroupService: CustomerGroupService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.customerGroupService.query().subscribe({
      next: (res: HttpResponse<ICustomerGroup[]>) => {
        this.isLoading = false;
        this.customerGroups = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICustomerGroup): number {
    return item.id!;
  }

  delete(customerGroup: ICustomerGroup): void {
    const modalRef = this.modalService.open(CustomerGroupDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.customerGroup = customerGroup;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
