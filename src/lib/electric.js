// Simple IndexedDB wrapper for local-first storage
let db = null;
const DB_NAME = "tomorrow-guy-db";
const DB_VERSION = 1;

export async function initDatabase() {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      console.log("✅ IndexedDB initialized");
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create tasks table
      if (!db.objectStoreNames.contains("tasks")) {
        const taskStore = db.createObjectStore("tasks", { keyPath: "id" });
        taskStore.createIndex("created_at", "created_at", { unique: false });
      }

      // Create app_state table
      if (!db.objectStoreNames.contains("app_state")) {
        db.createObjectStore("app_state", { keyPath: "id" });
      }
    };
  });
}

// Helper functions for IndexedDB operations
export async function getAllTasks() {
  if (!db) throw new Error("Database not initialized");

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["tasks"], "readonly");
    const store = transaction.objectStore("tasks");
    const request = store.getAll();

    request.onsuccess = () => {
      const tasks = request.result.sort((a, b) => b.created_at - a.created_at);
      resolve(tasks);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function addTask(task) {
  if (!db) throw new Error("Database not initialized");

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["tasks"], "readwrite");
    const store = transaction.objectStore("tasks");
    const request = store.add(task);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function updateTask(task) {
  if (!db) throw new Error("Database not initialized");

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["tasks"], "readwrite");
    const store = transaction.objectStore("tasks");
    const request = store.put(task);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteTask(id) {
  if (!db) throw new Error("Database not initialized");

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["tasks"], "readwrite");
    const store = transaction.objectStore("tasks");
    const request = store.delete(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAppState(id) {
  if (!db) throw new Error("Database not initialized");

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["app_state"], "readonly");
    const store = transaction.objectStore("app_state");
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function setAppState(state) {
  if (!db) throw new Error("Database not initialized");

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["app_state"], "readwrite");
    const store = transaction.objectStore("app_state");
    const request = store.put(state);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export { db };
