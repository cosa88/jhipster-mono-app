import { ICustomer } from 'app/entities/customer/customer.model';

export interface ICustomerGroup {
  id?: number;
  name?: string;
  enName?: string;
  customer?: ICustomer | null;
}

export class CustomerGroup implements ICustomerGroup {
  constructor(public id?: number, public name?: string, public enName?: string, public customer?: ICustomer | null) {}
}

export function getCustomerGroupIdentifier(customerGroup: ICustomerGroup): number | undefined {
  return customerGroup.id;
}
