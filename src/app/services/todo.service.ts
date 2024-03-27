import { Injectable } from '@angular/core';
import { ITodo } from '../models/ITodo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private collectionName = 'todos';
  private dbName: string = 'tomorrowGuyDb';
  private dbVersion: number = 1;
  private db!: IDBDatabase;

  constructor() {
    this.connectToDatabase();
  }

  private connectToDatabase() {
    const request = window.indexedDB.open(this.dbName, this.dbVersion);

    request.onerror = (event) => {
      console.error(
        'IndexedDB connection error:',
        (event.target as any)?.error
      );
    };

    request.onsuccess = (event) => {
      console.log('Connected to IndexedDB', event);
      this.db = (event.target as any).result;
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const store = db.createObjectStore(this.collectionName, {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('name', 'name', { unique: false });
      console.log('IndexedDB upgrade complete');
    };
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

  getAllTodos(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        [this.collectionName],
        'readonly'
      );
      const objectStore = transaction.objectStore(this.collectionName);
      const request = objectStore.getAll();

      request.onerror = (event) => {
        console.error('Error fetching items:', (event.target as any).error);
        reject((event.target as any).error);
      };

      request.onsuccess = (event) => {
        console.log('Items fetched successfully');
        resolve(request.result);
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
