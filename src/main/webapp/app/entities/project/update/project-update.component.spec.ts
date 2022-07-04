import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProjectService } from '../service/project.service';
import { IProject, Project } from '../project.model';
import { ICustomerGroup } from 'app/entities/customer-group/customer-group.model';
import { CustomerGroupService } from 'app/entities/customer-group/service/customer-group.service';

import { ProjectUpdateComponent } from './project-update.component';

describe('Project Management Update Component', () => {
  let comp: ProjectUpdateComponent;
  let fixture: ComponentFixture<ProjectUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let projectService: ProjectService;
  let customerGroupService: CustomerGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProjectUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ProjectUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    projectService = TestBed.inject(ProjectService);
    customerGroupService = TestBed.inject(CustomerGroupService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call customerGroup query and add missing value', () => {
      const project: IProject = { id: 456 };
      const customerGroup: ICustomerGroup = { id: 15350 };
      project.customerGroup = customerGroup;

      const customerGroupCollection: ICustomerGroup[] = [{ id: 95514 }];
      jest.spyOn(customerGroupService, 'query').mockReturnValue(of(new HttpResponse({ body: customerGroupCollection })));
      const expectedCollection: ICustomerGroup[] = [customerGroup, ...customerGroupCollection];
      jest.spyOn(customerGroupService, 'addCustomerGroupToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ project });
      comp.ngOnInit();

      expect(customerGroupService.query).toHaveBeenCalled();
      expect(customerGroupService.addCustomerGroupToCollectionIfMissing).toHaveBeenCalledWith(customerGroupCollection, customerGroup);
      expect(comp.customerGroupsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const project: IProject = { id: 456 };
      const customerGroup: ICustomerGroup = { id: 50354 };
      project.customerGroup = customerGroup;

      activatedRoute.data = of({ project });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(project));
      expect(comp.customerGroupsCollection).toContain(customerGroup);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Project>>();
      const project = { id: 123 };
      jest.spyOn(projectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ project });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: project }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(projectService.update).toHaveBeenCalledWith(project);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Project>>();
      const project = new Project();
      jest.spyOn(projectService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ project });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: project }));
      saveSubject.complete();

      // THEN
      expect(projectService.create).toHaveBeenCalledWith(project);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Project>>();
      const project = { id: 123 };
      jest.spyOn(projectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ project });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(projectService.update).toHaveBeenCalledWith(project);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCustomerGroupById', () => {
      it('Should return tracked CustomerGroup primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCustomerGroupById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
