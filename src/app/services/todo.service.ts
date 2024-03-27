import { Injectable } from '@angular/core';
import { ITodo } from '../models/ITodo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private collectionName = 'todos';
  private dbName: string = 'tomorrowGuyDb';
  private dbVersion: number = 1;
  private db!: IDBDatabase;

  // constructor() {
  //   this.connectToDatabase().then((result: IDBDatabase) => {
  //     this.db = result;
  //   });
  // }

  initialize(): Observable<void> {
    return new Observable<void>((observer) => {
      const request = window.indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('IndexedDB failed to open.');
        observer.error();
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB opened successfully.');
        observer.next();
        observer.complete();
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.collectionName)) {
          db.createObjectStore(this.collectionName, {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      };
    });
  }

  addTodo(todo: ITodo): void {
    todo.createdDate = new Date();
    todo.updatedDate = new Date();
    const transaction = this.db.transaction([this.collectionName], 'readwrite');
    const objectStore = transaction.objectStore(this.collectionName);
    const request = objectStore.add(todo);

    request.onerror = (event) => {
      console.error('Error adding item:', (event.target as any).error);
    };

    request.onsuccess = (event) => {
      console.log('Todo added successfully');
    };
  }

  getAllTodos(): Observable<ITodo[]> {
    return new Observable<ITodo[]>((observer) => {
      const transaction = this.db.transaction(
        [this.collectionName],
        'readonly'
      );
      const objectStore = transaction.objectStore(this.collectionName);
      const request = objectStore.getAll();

      request.onerror = (event) => {
        console.error('Error fetching items:', (event.target as any).error);
        observer.error((event.target as any).error);
      };

      request.onsuccess = (event) => {
        console.log('Items fetched successfully');
        observer.next(request.result);
      };
    });
  }

  updateTodo(todo: ITodo): void {
    todo.updatedDate = new Date();
    const transaction = this.db.transaction([this.collectionName], 'readwrite');
    const objectStore = transaction.objectStore(this.collectionName);
    const request = objectStore.put(todo);

    request.onerror = (event) => {
      console.error('Error updating item:', (event.target as any).error);
    };

    request.onsuccess = (event) => {
      console.log('Item updated successfully');
    };
  }

  deleteTodo(todoId: number): void {
    const transaction = this.db.transaction([this.collectionName], 'readwrite');
    const objectStore = transaction.objectStore(this.collectionName);
    const request = objectStore.delete(todoId);

    request.onerror = (event) => {
      console.error('Error deleting item:', (event.target as any).error);
    };

    request.onsuccess = (event) => {
      console.log('Item deleted successfully');
    };
  }
}
