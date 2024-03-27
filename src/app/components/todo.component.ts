import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { ITodo } from '../models/ITodo';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, AsyncPipe, DatePipe],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent {
  @Input() todo!: ITodo;
  @Output() delete = new EventEmitter<number>();
  @Output() toggleComplete = new EventEmitter<number>();

  onMarkAsComplete() {
    this.toggleComplete.emit(this.todo.id);
  }

  onDelete() {
    this.delete.emit(this.todo.id);
  }
}
