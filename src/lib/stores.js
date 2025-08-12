// @ts-check
import { writable } from "svelte/store";
import {
  initDatabase,
  getAllTasks,
  addTask as dbAddTask,
  updateTask as dbUpdateTask,
  deleteTask as dbDeleteTask,
  getAppState,
  setAppState,
} from "./electric.js";

/** @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {boolean} completed
 * @property {number} created_at
 * @property {number} updated_at
 * @property {string} list
 */

/** @typedef {Object} AppState
 * @property {string} id
 * @property {string} last_move_date
 * @property {number} updated_at
 */

// Reactive stores
export const tasks = writable(/** @type {Task[]} */ ([]));
export const isDbReady = writable(false);

let isInitialized = false;

// Initialize database
export async function initDataStores() {
  if (isInitialized) return;

  try {
    await initDatabase();

    // Load initial data
    await loadTasks();

    isDbReady.set(true);
    isInitialized = true;
    console.log("✅ Data stores ready");
  } catch (error) {
    console.error("❌ Data stores initialization failed:", error);
    isDbReady.set(false);
  }
}

// Load data functions
async function loadTasks() {
  try {
    const taskResults = await getAllTasks();
    tasks.set(taskResults || []);
  } catch (error) {
    console.error("Failed to load tasks:", error);
    tasks.set([]);
  }
}

// Task operations
/**
 * @param {string} title
 * @param {string} description
 */
export async function addTodayGuyTask(title, description = "") {
  try {
    const task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      created_at: Date.now(),
      updated_at: Date.now(),
      list: "today-guy",
    };

    await dbAddTask(task);
    await loadTasks(); // Refresh tasks
  } catch (error) {
    console.error("Failed to add task:", error);
  }
}

/**
 * @param {string} title
 * @param {string} description
 */
export async function addTomorrowGuyTask(title, description = "") {
  try {
    const task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      created_at: Date.now(),
      updated_at: Date.now(),
      list: "tomorrow-guy",
    };

    await dbAddTask(task);
    await loadTasks(); // Refresh tasks
  } catch (error) {
    console.error("Failed to add task:", error);
  }
}

/**
 * @param {string} id
 */
export async function toggleTask(id) {
  try {
    const currentTasks = await getAllTasks();
    const task = currentTasks.find(/** @param {Task} t */ (t) => t.id === id);

    if (task) {
      task.completed = !task.completed;
      task.updated_at = Date.now();
      await dbUpdateTask(task);
      await loadTasks(); // Refresh tasks
    }
  } catch (error) {
    console.error("Failed to toggle task:", error);
  }
}

/**
 * @param {string} id
 */
export async function deleteTask(id) {
  try {
    await dbDeleteTask(id);
    await loadTasks(); // Refresh tasks
  } catch (error) {
    console.error("Failed to delete task:", error);
  }
}

// Move a single task to Tomorrow Guy
/**
 * @param {string} taskId
 */
export async function moveTaskToTomorrowGuy(taskId) {
  try {
    const currentTasks = await getAllTasks();
    const task = currentTasks.find(
      /** @param {Task} t */ (t) => t.id === taskId
    );

    if (task) {
      task.list = "tomorrow-guy";
      task.updated_at = Date.now();
      await dbUpdateTask(task);
      await loadTasks(); // Refresh tasks
    }
  } catch (error) {
    console.error("Failed to move task to Tomorrow Guy:", error);
  }
}

// Move tomorrow tasks to today
export async function moveTomorrowTasksToToday() {
  try {
    const currentTasks = await getAllTasks();
    const tomorrowTasks = currentTasks.filter(
      /** @param {Task} task */ (task) => task.list === "tomorrow-guy"
    );

    // Move each tomorrow task to today
    for (const task of tomorrowTasks) {
      task.list = "today-guy";
      task.updated_at = Date.now();
      await dbUpdateTask(task);
    }

    // Update the last move date
    const moveState = {
      id: "last_move_date",
      last_move_date: new Date().toDateString(),
      updated_at: Date.now(),
    };
    await setAppState(moveState);

    await loadTasks(); // Refresh tasks
    console.log(
      `✅ Moved ${tomorrowTasks.length} tasks from Tomorrow Guy to Today Guy`
    );

    return tomorrowTasks.length;
  } catch (error) {
    console.error("Failed to move tomorrow tasks:", error);
    return 0;
  }
}

// Check if tasks should be moved (new day)
export async function checkAndMoveTasks() {
  try {
    const moveState = await getAppState("last_move_date");
    const today = new Date().toDateString();

    // If we haven't moved tasks today, do it now
    if (!moveState || moveState.last_move_date !== today) {
      return await moveTomorrowTasksToToday();
    }

    return 0;
  } catch (error) {
    console.error("Failed to check and move tasks:", error);
    return 0;
  }
}

// Initialize midnight timer
/** @type {NodeJS.Timeout | null} */
let midnightTimer = null;
/** @type {((message: string) => void) | null} */
let onTasksMoved = null; // Callback for when tasks are moved

/**
 * @param {(message: string) => void} callback
 */
export function setTaskMoveCallback(callback) {
  onTasksMoved = callback;
}

export function startMidnightTimer() {
  // Clear existing timer
  if (midnightTimer) {
    clearTimeout(midnightTimer);
  }

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Set to midnight

  const msUntilMidnight = tomorrow.getTime() - now.getTime();

  console.log(`⏰ Next task move scheduled for: ${tomorrow.toLocaleString()}`);

  midnightTimer = setTimeout(async () => {
    console.log(
      "🌙 Midnight reached, moving Tomorrow Guy tasks to Today Guy..."
    );
    const movedCount = await moveTomorrowTasksToToday();

    // Call the callback if it exists
    if (onTasksMoved && movedCount > 0) {
      onTasksMoved(
        `Good morning! Moved ${movedCount} task${
          movedCount === 1 ? "" : "s"
        } from Tomorrow Guy to Today Guy! 🌅`
      );
    }

    // Schedule the next check
    startMidnightTimer();
  }, msUntilMidnight);
}

export function stopMidnightTimer() {
  if (midnightTimer) {
    clearTimeout(midnightTimer);
    midnightTimer = null;
    console.log("🛑 Midnight timer stopped");
  }
}
