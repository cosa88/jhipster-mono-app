import { ICustomerGroup } from 'app/entities/customer-group/customer-group.model';

export interface IProject {
  id?: number;
  name?: string;
  customerGroup?: ICustomerGroup | null;
}

export class Project implements IProject {
  constructor(public id?: number, public name?: string, public customerGroup?: ICustomerGroup | null) {}
}

export function getProjectIdentifier(project: IProject): number | undefined {
  return project.id;
}
