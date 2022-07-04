import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProject, Project } from '../project.model';
import { ProjectService } from '../service/project.service';
import { ICustomerGroup } from 'app/entities/customer-group/customer-group.model';
import { CustomerGroupService } from 'app/entities/customer-group/service/customer-group.service';

@Component({
  selector: 'jhi-project-update',
  templateUrl: './project-update.component.html',
})
export class ProjectUpdateComponent implements OnInit {
  isSaving = false;

  customerGroupsCollection: ICustomerGroup[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    customerGroup: [],
  });

  constructor(
    protected projectService: ProjectService,
    protected customerGroupService: CustomerGroupService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.updateForm(project);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const project = this.createFromForm();
    if (project.id !== undefined) {
      this.subscribeToSaveResponse(this.projectService.update(project));
    } else {
      this.subscribeToSaveResponse(this.projectService.create(project));
    }
  }

  trackCustomerGroupById(_index: number, item: ICustomerGroup): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProject>>): void {
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

  protected updateForm(project: IProject): void {
    this.editForm.patchValue({
      id: project.id,
      name: project.name,
      customerGroup: project.customerGroup,
    });

    this.customerGroupsCollection = this.customerGroupService.addCustomerGroupToCollectionIfMissing(
      this.customerGroupsCollection,
      project.customerGroup
    );
  }

  protected loadRelationshipsOptions(): void {
    this.customerGroupService
      .query({ filter: 'project-is-null' })
      .pipe(map((res: HttpResponse<ICustomerGroup[]>) => res.body ?? []))
      .pipe(
        map((customerGroups: ICustomerGroup[]) =>
          this.customerGroupService.addCustomerGroupToCollectionIfMissing(customerGroups, this.editForm.get('customerGroup')!.value)
        )
      )
      .subscribe((customerGroups: ICustomerGroup[]) => (this.customerGroupsCollection = customerGroups));
  }

  protected createFromForm(): IProject {
    return {
      ...new Project(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      customerGroup: this.editForm.get(['customerGroup'])!.value,
    };
  }
}
