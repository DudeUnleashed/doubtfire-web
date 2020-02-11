import { Unit } from './../../../../../ajs-upgraded-providers';
import { TutorialStream } from 'src/app/api/models/tutorial-stream/tutorial-stream';
import { Tutorial } from 'src/app/api/models/tutorial/tutorial';
import { ViewChild, Component, Input, Inject } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { alertService, Project } from 'src/app/ajs-upgraded-providers';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'unit-students-editor',
  templateUrl: 'unit-students-editor.component.html',
  styleUrls: ['unit-students-editor.component.scss']
})
export class UnitStudentsEditorComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @Input() unit: any;

  columns: string[] = ['username', 'firstName', 'lastName', 'email', 'tutorial', 'enrolled'];
  dataSource: MatTableDataSource<any>;
  tutorials: Tutorial[];
  streams: TutorialStream[];

  // Calls the parent's constructor, passing in an object
  // that maps all of the form controls that this form consists of.
  constructor(
    @Inject(alertService) private alerts: any,
    @Inject(Project) private project: any,
    @Inject(Unit) private u: any
  ) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.unit.students);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.tutorials = this.unit.tutorials;
    this.streams = this.unit.tutorial_streams;
  }

  compareSelection(aEntity:  any, bEntity: any) {
    if (!aEntity || !bEntity) {
      return;
    }
    return aEntity.id === bEntity.tutorial;
  }

  tutorialsForStreamAndStudent(student: any, stream: TutorialStream = undefined) {
    return this.tutorials.filter(tutorial => {
      if (tutorial.tutorial_stream && stream) {
        return tutorial.tutorial_stream.abbreviation === stream.abbreviation
          && student.campus_id === tutorial.campus.id;
      } else if (!tutorial.tutorial_stream && !stream) {
        return student.campus_id === tutorial.campus.id;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateStudentEnrollment(student: any) {
    const newEnrollment = !student.enrolled;
    this.project.update({id: student.project_id, enrolled: !student.enrolled}, (project) => {
      if (newEnrollment === project.enrolled) {
        this.alerts.add('success', 'Enrolment changed.', 2000);
      } else {
        this.alerts.add('danger', 'Enrolment change failed.', 5000);
      }
    }, (response) => {
      this.alerts.add('danger', response.data.error, 5000);
    });
  }

  studentHasTutorials(student: any) {
    return student.tutorial_streams.filter(tutorialStream => tutorialStream.tutorial).length > 0;
  }

  switchToTutorial(student: any, tutorial: Tutorial) {
    // // Handle case where tutorial doesn't belong to a stream
    // if (!tutorial.tutorial_stream) {
    //   const currentEnrollments = student.tutorial_streams.filter(tutorial => tutorial.tutorial);
    //   currentEnrollments.forEach(enrolledTutorial => {
    //     this.modifyTutorialEnrollment(student, this.unit.tutorialFromId(enrolledTutorial.tutorial), false);
    //   });
    //   this.modifyTutorialEnrollment(student, tutorial);
    // } else {
    //   // 1. Un-enroll from any tutorials without a stream
    //   // 2. Make sure a student can only be enrolled into one tutorial per stream
    //   const matchingStreamEnrollments = student.tutorial_streams.find(
    //     t => tutorial.tutorial_stream.abbreviation === t.stream && t.tutorial
    //   );
    //   if (matchingStreamEnrollments) {
    //     this.modifyTutorialEnrollment(student, this.unit.tutorialFromId(matchingStreamEnrollments.tutorial), false);
    //   }
    //   this.modifyTutorialEnrollment(student, tutorial);
    // }
    // this.table.renderRows();
  }

  private modifyTutorialEnrollment(student: any, tutorial: Tutorial, create: boolean = true) {
    // const action: string = create ? 'create' : 'delete';
    // this.u.tutorialEnrollment[action](
    //   {
    //     id: this.unit.id,
    //     tutorial_abbreviation: tutorial.abbreviation,
    //     project_id: student.project_id
    //   },
    //   (enrollment) => {
    //     this.alerts.add('success', 'Student tutorial enrollment updated.', 2000);
    //     if (create && tutorial.tutorial_stream) {
    //       student.tutorial_streams.find(t => t.stream === tutorial.tutorial_stream.abbreviation).tutorial = tutorial.id;
    //     }
    //     if (!create) {
    //       student.tutorial_streams.find(t => t.stream === tutorial.tutorial_stream.abbreviation).tutorial = undefined;
    //     }
    //   },
    //   (response) => {
    //     this.alerts.add('danger', response.data.error, 5000);
    //   }
    // );
  }
}
