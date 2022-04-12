import {async,waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';

describe('CoursesCardListComponent', () => {
  let component:CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>
  let el: DebugElement;

  //waitForAsync will ensure to wait for async function to finished run
  beforeEach(waitForAsync(()=>{
    TestBed.configureTestingModule({
      imports:[CoursesModule]
    }).compileComponents()
    .then(()=>{
      fixture = TestBed.createComponent(CoursesCardListComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
    });
  }));
  //1. Make sure component is loaded/
  it("should create the component", () => {
   expect(component).toBeTruthy();
  });

  //2. Make sure the template is loaded
  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges(); //Need to manually trigger change detection and to perform data binding 
    
    const cards = el.queryAll(By.css(".course-card")); //Finding the css class name
    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12,"Undexpected number of courses");
  });

  //3. Make sure the data is loaded/display into the template
  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const course = component.courses[0];
    const card = el.query(By.css(".course-card:first-child")),
           title = card.query(By.css("mat-card-title")),
           image = card.query(By.css("img"));

    expect(card).toBeTruthy("could not find course card");
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);

  });


});


