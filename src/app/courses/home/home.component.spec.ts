import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';
import { features } from 'process';





describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let el: DebugElement;
  let coursesService: any;
  const beginnerCourses = setupCourses().filter(course =>
    course.category == 'BEGINNER');
  const advanceCourses = setupCourses().filter(course =>
      course.category == 'ADVANCED');
  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService',['findAllCourses']);

    TestBed.configureTestingModule({
      //NoopAnimationsModule will not have animation (Testing purpose), but the material component
      //will still works. In other words, must have either BrowserAnimationsModule OR NoopAnimationsModule
      //for the angular material components to works
      imports:[CoursesModule,NoopAnimationsModule],
      //We dont want to use the actual CoursesService inside CoursesModule
      //because it will trigger the actual http request to the server which will caused error
      //becayse the server is not run in the test environment
      //for testing, we need to override the CoursesService with our own mock instance
      providers:[{provide:CoursesService, useValue:coursesServiceSpy}]
    }).compileComponents().then(()=>{
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      coursesService = TestBed.inject(CoursesService);
    })
  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {

    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1,"Unexpected number of tabs found");
  });


  it("should display only advanced courses", () => {

    coursesService.findAllCourses.and.returnValue(of(advanceCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1,"Unexpected number of tabs found");
  });


  it("should display both tabs", () => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(2,"Unexpected number of tabs found");

  });

  //With fakeAsync method
  //This method is still preferred over waitForAync
  //More convenient and less error
  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    click(tabs[1]);
    fixture.detectChanges();
    flush();
    fixture.detectChanges();
    const cardTitles = el.queryAll(By.css('.mat-card-title'));
    expect(cardTitles.length).toBeGreaterThan(0,"could not find card titles");
    expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");
  }));

  //with waitForAsync method
  //Only things that waitForAsync have is can perform real httpRequest to real backend/api
  //Make sure the browser is not minimized when running this test
  //"requestAnimationFrame() calls are paused in most browsers when running in background tabs or hidden <iframe>s in order to improve performance and battery life."
  fit("should display advanced courses when tab clicked - waitForAsync", waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    click(tabs[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() =>{
      fixture.detectChanges();
      const cardTitles = el.queryAll(By.css('.mat-card-title'));
    expect(cardTitles.length).toBeGreaterThan(0,"could not find card titles");
    expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");
    })
  }));
});


