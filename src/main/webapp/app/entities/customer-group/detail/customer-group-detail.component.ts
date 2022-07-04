import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICustomerGroup } from '../customer-group.model';

@Component({
  selector: 'jhi-customer-group-detail',
  templateUrl: './customer-group-detail.component.html',
})
export class CustomerGroupDetailComponent implements OnInit {
  customerGroup: ICustomerGroup | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customerGroup }) => {
      this.customerGroup = customerGroup;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
