import { ICustomerGroup } from 'app/entities/customer-group/customer-group.model';

export interface ICustomer {
  id?: number;
  name?: string;
  enName?: string;
  fullName?: string;
  customerGroups?: ICustomerGroup[] | null;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public name?: string,
    public enName?: string,
    public fullName?: string,
    public customerGroups?: ICustomerGroup[] | null
  ) {}
}

export function getCustomerIdentifier(customer: ICustomer): number | undefined {
  return customer.id;
}
