import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoService } from './services/todo.service';
import { ITodo } from './models/ITodo';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'tomorrow-guy';
  todoService = inject(TodoService);
  public todos: ITodo[] = [];

  async ngOnInit(): Promise<void> {
    setTimeout(async () => {
      await this.todoService.addTodo({
        id: crypto.randomUUID(),
        name: 'Take out trash',
        description: 'Take out the trash on Thursday nights.',
        dueDate: this.getNextThursday(),
      });
      this.todos = await this.todoService.getAllTodos();
    }, 5000);
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
}
