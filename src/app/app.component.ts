import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoService } from './services/todo.service';
import { ITodo } from './models/ITodo';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { BehaviorSubject, Observable, filter, map, switchMap } from 'rxjs';
import { TodoComponent } from './components/todo.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface ITodoForm {
  name: string;
  description: string;
  dueDate: Date;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    JsonPipe,
    AsyncPipe,
    TodoComponent,
    NgFor,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'tomorrow-guy';
  todoService = inject(TodoService);
  cdr = inject(ChangeDetectorRef);
  formBuilder = inject(FormBuilder);
  todoForm!: FormGroup;
  _reloadTodos = new BehaviorSubject<void>(0 as any);
  _reloadCompletedTodos = new BehaviorSubject<void>(0 as any);
  public todos$!: Observable<ITodo[]>;
  public completedTodos$!: Observable<ITodo[]>;

  ngOnInit() {
    this.todoForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
    });
    this.todoService.initialize().subscribe(() => {
      this.todos$ = this._reloadTodos.pipe(
        switchMap(() => {
          return this.todoService
            .getAllTodos()
            .pipe(map((list) => list.filter((val) => val.completed === false)));
        })
      );
      this.completedTodos$ = this._reloadCompletedTodos.pipe(
        switchMap(() => {
          return this.todoService
            .getAllTodos()
            .pipe(map((list) => list.filter((val) => val.completed === true)));
        })
      );
      this.refreshTodos();
    });
  }

  onTodoMarkedAsCompleted(todo: ITodo) {
    todo.completed = true;
    this.todoService.updateTodo(todo);
    this.refreshTodos();
  }

  onTodoMarkedAsNotCompleted(todo: ITodo) {
    todo.completed = false;
    this.todoService.updateTodo(todo);
    this.refreshTodos();
  }

  onTodoDeleted(id: number) {
    this.todoService.deleteTodo(id);
    this.refreshTodos();
  }

  getNextThursday(): Date {
    // Get the current date
    let currentDate = new Date();

    // Calculate the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    let currentDay = currentDate.getDay();

    // Calculate the number of days until the next Thursday (assuming Sunday is 0)
    let daysUntilThursday = (4 - currentDay + 7) % 7;

    // Add the number of days until Thursday to the current date
    let nextThursday = new Date(
      currentDate.getTime() + daysUntilThursday * 24 * 60 * 60 * 1000
    );
    return nextThursday;
  }

  onAddTodo() {
    if (this.todoForm.valid) {
      this.todoService.addTodo(this.todoForm.value);
      this.todoForm.reset();
      this.refreshTodos();
    }
  }

  refreshTodos() {
    this._reloadTodos.next();
    this._reloadCompletedTodos.next();
  }
}
