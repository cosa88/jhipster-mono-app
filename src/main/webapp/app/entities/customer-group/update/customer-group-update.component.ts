import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICustomerGroup, CustomerGroup } from '../customer-group.model';
import { CustomerGroupService } from '../service/customer-group.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

@Component({
  selector: 'jhi-customer-group-update',
  templateUrl: './customer-group-update.component.html',
})
export class CustomerGroupUpdateComponent implements OnInit {
  isSaving = false;

  customersSharedCollection: ICustomer[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    enName: [null, [Validators.required]],
    customer: [],
  });

  constructor(
    protected customerGroupService: CustomerGroupService,
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customerGroup }) => {
      this.updateForm(customerGroup);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customerGroup = this.createFromForm();
    if (customerGroup.id !== undefined) {
      this.subscribeToSaveResponse(this.customerGroupService.update(customerGroup));
    } else {
      this.subscribeToSaveResponse(this.customerGroupService.create(customerGroup));
    }
  }

  trackCustomerById(_index: number, item: ICustomer): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomerGroup>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(customerGroup: ICustomerGroup): void {
    this.editForm.patchValue({
      id: customerGroup.id,
      name: customerGroup.name,
      enName: customerGroup.enName,
      customer: customerGroup.customer,
    });

    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing(
      this.customersSharedCollection,
      customerGroup.customer
    );
  }

  protected loadRelationshipsOptions(): void {
    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing(customers, this.editForm.get('customer')!.value)
        )
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));
  }

  protected createFromForm(): ICustomerGroup {
    return {
      ...new CustomerGroup(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      enName: this.editForm.get(['enName'])!.value,
      customer: this.editForm.get(['customer'])!.value,
    };
  }
}
