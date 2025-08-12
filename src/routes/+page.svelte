<script>
  import { onMount } from "svelte";
  import {
    tasks,
    isDbReady,
    initDataStores,
    addTodayGuyTask,
    addTomorrowGuyTask,
    toggleTask,
    deleteTask,
    checkAndMoveTasks,
    moveTomorrowTasksToToday,
    moveTaskToTomorrowGuy,
    startMidnightTimer,
    stopMidnightTimer,
    setTaskMoveCallback,
  } from "$lib/stores.js";

  let today = new Date();
  let isOnline = $state(navigator.onLine);
  let installPrompt = $state(null);
  let isInstalled = $state(false);
  let newTodayTask = $state("");
  let newTomorrowTask = $state("");
  let notification = $state(null); // For showing move notifications

  // Reactive task lists
  let todayTasks = $state([]);
  let tomorrowTasks = $state([]);

  // Subscribe to tasks and split them by list
  $effect(() => {
    const unsubscribe = tasks.subscribe((allTasks) => {
      todayTasks = allTasks.filter((task) => task.list === "today-guy");
      tomorrowTasks = allTasks.filter((task) => task.list === "tomorrow-guy");
    });
    return unsubscribe;
  });

  // Get stress level based on incomplete task count
  function getStressLevel(tasks) {
    const incompleteTaskCount = tasks.filter((task) => !task.completed).length;
    if (incompleteTaskCount === 0) return "happy";
    if (incompleteTaskCount <= 2) return "concerned";
    if (incompleteTaskCount <= 5) return "stressed";
    return "overwhelmed";
  }

  async function giveItToTomorrowGuy(task) {
    await moveTaskToTomorrowGuy(task.id);
  }

  // Get character emoji and style based on stress level
  function getCharacterData(stressLevel) {
    switch (stressLevel) {
      case "happy":
        return {
          emoji: "😊",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          pixelArt: `
            <svg width="64" height="64" viewBox="0 0 16 16" style="image-rendering: pixelated;">
              <!-- Head -->
              <rect x="4" y="2" width="8" height="8" fill="#FFD93D"/>
              <rect x="3" y="3" width="1" height="6" fill="#FFD93D"/>
              <rect x="12" y="3" width="1" height="6" fill="#FFD93D"/>
              <!-- Happy eyes (closed/squinting from joy) -->
              <rect x="5" y="5" width="2" height="1" fill="#000"/>
              <rect x="6" y="4" width="1" height="1" fill="#000"/>
              <rect x="8" y="5" width="2" height="1" fill="#000"/>
              <rect x="9" y="4" width="1" height="1" fill="#000"/>
              <!-- Big happy smile -->
              <rect x="5" y="7" width="1" height="1" fill="#000"/>
              <rect x="6" y="8" width="1" height="1" fill="#000"/>
              <rect x="7" y="8" width="2" height="1" fill="#000"/>
              <rect x="9" y="8" width="1" height="1" fill="#000"/>
              <rect x="10" y="7" width="1" height="1" fill="#000"/>
              <!-- Body -->
              <rect x="5" y="10" width="6" height="4" fill="#4CAF50"/>
              <!-- Happy arms up -->
              <rect x="3" y="10" width="2" height="2" fill="#FFD93D"/>
              <rect x="11" y="10" width="2" height="2" fill="#FFD93D"/>
            </svg>
          `,
        };
      case "concerned":
        return {
          emoji: "😐",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          pixelArt: `
            <svg width="64" height="64" viewBox="0 0 16 16" style="image-rendering: pixelated;">
              <!-- Head -->
              <rect x="4" y="2" width="8" height="8" fill="#FFD93D"/>
              <rect x="3" y="3" width="1" height="6" fill="#FFD93D"/>
              <rect x="12" y="3" width="1" height="6" fill="#FFD93D"/>
              <!-- Concerned eyebrows (angled down) -->
              <rect x="5" y="4" width="2" height="1" fill="#8B4513"/>
              <rect x="6" y="3" width="1" height="1" fill="#8B4513"/>
              <rect x="8" y="3" width="1" height="1" fill="#8B4513"/>
              <rect x="9" y="4" width="2" height="1" fill="#8B4513"/>
              <!-- Neutral/worried eyes -->
              <rect x="6" y="5" width="1" height="1" fill="#000"/>
              <rect x="9" y="5" width="1" height="1" fill="#000"/>
              <!-- Flat concerned mouth -->
              <rect x="6" y="7" width="4" height="1" fill="#000"/>
              <!-- Body -->
              <rect x="5" y="10" width="6" height="4" fill="#FFC107"/>
              <!-- Arms slightly drooped -->
              <rect x="3" y="12" width="2" height="2" fill="#FFD93D"/>
              <rect x="11" y="12" width="2" height="2" fill="#FFD93D"/>
            </svg>
          `,
        };
      case "stressed":
        return {
          emoji: "😰",
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
          pixelArt: `
            <svg width="64" height="64" viewBox="0 0 16 16" style="image-rendering: pixelated;">
              <!-- Head -->
              <rect x="4" y="2" width="8" height="8" fill="#FFD93D"/>
              <rect x="3" y="3" width="1" height="6" fill="#FFD93D"/>
              <rect x="12" y="3" width="1" height="6" fill="#FFD93D"/>
              <!-- Very worried eyebrows (V shape) -->
              <rect x="5" y="3" width="1" height="1" fill="#8B4513"/>
              <rect x="6" y="4" width="1" height="1" fill="#8B4513"/>
              <rect x="7" y="5" width="1" height="1" fill="#8B4513"/>
              <rect x="8" y="5" width="1" height="1" fill="#8B4513"/>
              <rect x="9" y="4" width="1" height="1" fill="#8B4513"/>
              <rect x="10" y="3" width="1" height="1" fill="#8B4513"/>
              <!-- Wide stressed eyes -->
              <rect x="5" y="5" width="2" height="2" fill="#FFF"/>
              <rect x="6" y="6" width="1" height="1" fill="#000"/>
              <rect x="9" y="5" width="2" height="2" fill="#FFF"/>
              <rect x="9" y="6" width="1" height="1" fill="#000"/>
              <!-- Open mouth (stressed gasp) -->
              <rect x="7" y="7" width="2" height="2" fill="#000"/>
              <!-- Multiple sweat drops -->
              <rect x="2" y="4" width="1" height="1" fill="#87CEEB"/>
              <rect x="3" y="5" width="1" height="1" fill="#87CEEB"/>
              <rect x="12" y="3" width="1" height="1" fill="#87CEEB"/>
              <rect x="13" y="4" width="1" height="1" fill="#87CEEB"/>
              <!-- Body -->
              <rect x="5" y="10" width="6" height="4" fill="#FF9800"/>
              <!-- Arms up in panic -->
              <rect x="2" y="9" width="2" height="2" fill="#FFD93D"/>
              <rect x="12" y="9" width="2" height="2" fill="#FFD93D"/>
            </svg>
          `,
        };
      case "overwhelmed":
        return {
          emoji: "😵‍💫",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          pixelArt: `
            <svg width="64" height="64" viewBox="0 0 16 16" style="image-rendering: pixelated;">
              <!-- Head -->
              <rect x="4" y="2" width="8" height="8" fill="#FFD93D"/>
              <rect x="3" y="3" width="1" height="6" fill="#FFD93D"/>
              <rect x="12" y="3" width="1" height="6" fill="#FFD93D"/>
              <!-- Dizzy/overwhelmed eyebrows (chaotic) -->
              <rect x="4" y="3" width="1" height="1" fill="#8B4513"/>
              <rect x="5" y="2" width="1" height="1" fill="#8B4513"/>
              <rect x="10" y="2" width="1" height="1" fill="#8B4513"/>
              <rect x="11" y="3" width="1" height="1" fill="#8B4513"/>
              <!-- Spiral dizzy eyes -->
              <rect x="5" y="4" width="3" height="3" fill="#FFF"/>
              <rect x="6" y="5" width="1" height="1" fill="#000"/>
              <rect x="5" y="5" width="1" height="1" fill="#000"/>
              <rect x="7" y="4" width="1" height="1" fill="#000"/>
              <rect x="8" y="4" width="3" height="3" fill="#FFF"/>
              <rect x="9" y="5" width="1" height="1" fill="#000"/>
              <rect x="10" y="5" width="1" height="1" fill="#000"/>
              <rect x="9" y="4" width="1" height="1" fill="#000"/>
              <!-- Wide open shocked mouth -->
              <rect x="6" y="7" width="4" height="3" fill="#000"/>
              <rect x="7" y="8" width="2" height="1" fill="#FF6B6B"/>
              <!-- Lots of sweat drops -->
              <rect x="1" y="2" width="1" height="1" fill="#87CEEB"/>
              <rect x="2" y="3" width="1" height="1" fill="#87CEEB"/>
              <rect x="1" y="6" width="1" height="1" fill="#87CEEB"/>
              <rect x="13" y="2" width="1" height="1" fill="#87CEEB"/>
              <rect x="14" y="4" width="1" height="1" fill="#87CEEB"/>
              <rect x="13" y="6" width="1" height="1" fill="#87CEEB"/>
              <!-- Body -->
              <rect x="5" y="10" width="6" height="4" fill="#F44336"/>
              <!-- Arms flailing wildly -->
              <rect x="1" y="8" width="2" height="2" fill="#FFD93D"/>
              <rect x="13" y="7" width="2" height="2" fill="#FFD93D"/>
              <!-- Stress lines around entire head -->
              <rect x="2" y="1" width="1" height="1" fill="#FF0000"/>
              <rect x="4" y="1" width="1" height="1" fill="#FF0000"/>
              <rect x="11" y="1" width="1" height="1" fill="#FF0000"/>
              <rect x="13" y="1" width="1" height="1" fill="#FF0000"/>
              <rect x="1" y="4" width="1" height="1" fill="#FF0000"/>
              <rect x="14" y="3" width="1" height="1" fill="#FF0000"/>
              <rect x="1" y="8" width="1" height="1" fill="#FF0000"/>
              <rect x="14" y="7" width="1" height="1" fill="#FF0000"/>
            </svg>
          `,
        };
      default:
        return {
          emoji: "😊",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          pixelArt: `
            <svg width="64" height="64" viewBox="0 0 16 16" style="image-rendering: pixelated;">
              <!-- Head -->
              <rect x="4" y="2" width="8" height="8" fill="#FFD93D"/>
              <rect x="3" y="3" width="1" height="6" fill="#FFD93D"/>
              <rect x="12" y="3" width="1" height="6" fill="#FFD93D"/>
              <!-- Happy eyes -->
              <rect x="5" y="5" width="2" height="1" fill="#000"/>
              <rect x="6" y="4" width="1" height="1" fill="#000"/>
              <rect x="8" y="5" width="2" height="1" fill="#000"/>
              <rect x="9" y="4" width="1" height="1" fill="#000"/>
              <!-- Big smile -->
              <rect x="5" y="7" width="1" height="1" fill="#000"/>
              <rect x="6" y="8" width="1" height="1" fill="#000"/>
              <rect x="7" y="8" width="2" height="1" fill="#000"/>
              <rect x="9" y="8" width="1" height="1" fill="#000"/>
              <rect x="10" y="7" width="1" height="1" fill="#000"/>
              <!-- Body -->
              <rect x="5" y="10" width="6" height="4" fill="#4CAF50"/>
              <!-- Arms -->
              <rect x="3" y="10" width="2" height="2" fill="#FFD93D"/>
              <rect x="11" y="10" width="2" height="2" fill="#FFD93D"/>
            </svg>
          `,
        };
    }
  }

  async function handleAddTodayTask(event) {
    event.preventDefault();
    if (newTodayTask.trim()) {
      await addTodayGuyTask(newTodayTask.trim());
      newTodayTask = "";
    }
  }

  async function handleAddTomorrowTask(event) {
    event.preventDefault();
    if (newTomorrowTask.trim()) {
      await addTomorrowGuyTask(newTomorrowTask.trim());
      newTomorrowTask = "";
    }
  }

  // Manual trigger for moving tomorrow tasks to today (for testing/manual use)
  async function handleManualMove() {
    const movedCount = await moveTomorrowTasksToToday();
    if (movedCount > 0) {
      console.log(
        `Manually moved ${movedCount} tasks from Tomorrow Guy to Today Guy`
      );
      showNotification(
        `Moved ${movedCount} task${movedCount === 1 ? "" : "s"} to Today Guy! 🚀`
      );
    } else {
      console.log("No tasks to move");
      showNotification("No tasks to move! 😌");
    }
  }

  // Show notification helper
  function showNotification(message) {
    notification = message;
    setTimeout(() => {
      notification = null;
    }, 3000); // Hide after 3 seconds
  }

  onMount(async () => {
    // Initialize database and stores
    await initDataStores();

    // Set up callback for automatic task moves
    setTaskMoveCallback((message) => {
      showNotification(message);
    });

    // Check and move tasks if it's a new day
    await checkAndMoveTasks();

    // Start the midnight timer for automatic task moving
    startMidnightTimer();

    // Register service worker for PWA
    if ("serviceWorker" in navigator) {
      import("/src/pwa.js");
    }

    // Handle online/offline status
    function updateOnlineStatus() {
      isOnline = navigator.onLine;
    }

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Handle PWA install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      installPrompt = e;
    });

    // Check if app is already installed
    window.addEventListener("appinstalled", () => {
      isInstalled = true;
      installPrompt = null;
    });

    // Check if running as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      isInstalled = true;
    }

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      // Clean up the midnight timer when component unmounts
      stopMidnightTimer();
    };
  });

  async function installPWA() {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        isInstalled = true;
      }
      installPrompt = null;
    }
  }
</script>

<svelte:head>
  <title>Tomorrow Guy - Local-First PWA</title>
</svelte:head>

<div
  class="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"
>
  <!-- Header -->
  <header class="bg-white/10 backdrop-blur-sm border-b border-white/20">
    <div class="max-w-6xl mx-auto px-4 py-6">
      <h1 class="text-4xl font-bold text-white text-center drop-shadow-lg">
        Tomorrow Guy
      </h1>
      <p class="text-white/80 text-center mt-2">
        Feeling overwhelmed? Make it Tomorrow Guy's problem!
      </p>
    </div>
  </header>

  <!-- Notification Toast -->
  {#if notification}
    <div
      class="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out"
    >
      {notification}
    </div>
  {/if}

  <!-- Main Content -->
  <main class="max-w-6xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Today Guy Column -->
      <section class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
        <div class="text-center mb-6">
          <div class="relative">
            {#if getCharacterData(getStressLevel(todayTasks))}
              {@const charData = getCharacterData(getStressLevel(todayTasks))}
              <div
                class="inline-flex items-center justify-center w-20 h-20 mb-4 transition-all duration-500 transform {todayTasks.filter(
                  (t) => !t.completed
                ).length > 3
                  ? ''
                  : ''}"
              >
                {@html charData.pixelArt}
              </div>
              <h2
                class="text-2xl font-bold {charData.textColor} transition-colors duration-300"
              >
                Today Guy
              </h2>
              <p class="text-sm text-gray-600 mt-1">
                {todayTasks.filter((t) => !t.completed).length === 0
                  ? "Feeling great!"
                  : todayTasks.filter((t) => !t.completed).length <= 2
                    ? "Getting a bit busy..."
                    : todayTasks.filter((t) => !t.completed).length <= 5
                      ? "Feeling the pressure!"
                      : "Totally overwhelmed! 😵"}
              </p>
            {/if}
          </div>
        </div>

        <!-- Add Task Form -->
        <form onsubmit={handleAddTodayTask} class="mb-6">
          <div class="flex gap-2">
            <input
              bind:value={newTodayTask}
              type="text"
              placeholder="Add a task for today..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
            >
              Add
            </button>
          </div>
        </form>

        <!-- Tasks List -->
        <div
          class="space-y-3 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          {#if todayTasks.length === 0}
            <div class="text-center py-8 text-gray-500">
              <div class="text-6xl mb-4">🎉</div>
              <p>No tasks yet! Today Guy is feeling great!</p>
            </div>
          {:else}
            {#each todayTasks as task}
              <div
                class="flex items-center gap-4 p-4 bg-white rounded-lg transition-all duration-200 hover:bg-gray-100 shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onchange={() => toggleTask(task.id)}
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span
                  class="flex-1 {task.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-900'} transition-all duration-200"
                >
                  {task.title}
                </span>
                <button
                  onclick={() => deleteTask(task.id)}
                  class="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 cursor-pointer"
                  title="Delete task"
                >
                  ❌
                </button>
                <button
                  onclick={() => giveItToTomorrowGuy(task)}
                  class="text-purple-500 hover:text-purple-700 transition-colors duration-200 p-1 cursor-pointer"
                  title="Give it to Tomorrow Guy"
                >
                  👉
                </button>
              </div>
            {/each}
          {/if}
        </div>
      </section>

      <!-- Tomorrow Guy Column -->
      <section class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
        <div class="text-center mb-6">
          <div class="relative">
            {#if getCharacterData(getStressLevel(tomorrowTasks))}
              {@const charData = getCharacterData(
                getStressLevel(tomorrowTasks)
              )}
              <div
                class="inline-flex items-center justify-center w-20 h-20 mb-4 transition-all duration-500 transform {tomorrowTasks.filter(
                  (t) => !t.completed
                ).length > 3
                  ? ''
                  : ''}"
              >
                {@html charData.pixelArt}
              </div>
              <h2
                class="text-2xl font-bold {charData.textColor} transition-colors duration-300"
              >
                Tomorrow Guy
              </h2>
              <p class="text-sm text-gray-600 mt-1">
                {tomorrowTasks.filter((t) => !t.completed).length === 0
                  ? "Living in the moment!"
                  : tomorrowTasks.filter((t) => !t.completed).length <= 2
                    ? "Some concerns ahead..."
                    : tomorrowTasks.filter((t) => !t.completed).length <= 5
                      ? "Getting anxious about tomorrow!"
                      : "Panicking about the future! 😵‍💫"}
              </p>
              <!-- Manual Move Button (for testing/emergency) -->
              {#if tomorrowTasks.length > 0}
                <button
                  onclick={handleManualMove}
                  class="mt-3 px-3 py-1 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer"
                  title="Move all Tomorrow Guy tasks to Today Guy (happens automatically at midnight)"
                >
                  🚀 Move to Today
                </button>
              {/if}
            {/if}
          </div>
        </div>

        <!-- Add Task Form -->
        <form onsubmit={handleAddTomorrowTask} class="mb-6">
          <div class="flex gap-2">
            <input
              bind:value={newTomorrowTask}
              type="text"
              placeholder="Add a problem for tomorrow..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 cursor-pointer"
            >
              Add
            </button>
          </div>
        </form>

        <!-- Tasks List -->
        <div
          class="space-y-3 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          {#if tomorrowTasks.length === 0}
            <div class="text-center py-8 text-gray-500">
              <div class="text-6xl mb-4">🌅</div>
              <p>No future worries! Tomorrow Guy is chill!</p>
            </div>
          {:else}
            {#each tomorrowTasks as task}
              <div
                class="flex items-center gap-4 p-4 bg-white rounded-lg transition-all duration-200 hover:bg-gray-100 shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onchange={() => toggleTask(task.id)}
                  class="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span
                  class="flex-1 {task.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-900'} transition-all duration-200"
                >
                  {task.title}
                </span>
                <button
                  onclick={() => deleteTask(task.id)}
                  class="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 cursor-pointer"
                  title="Delete task"
                >
                  ❌
                </button>
              </div>
            {/each}
          {/if}
        </div>
      </section>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-white/10 backdrop-blur-sm border-t border-white/20 mt-12">
    <div class="max-w-6xl mx-auto px-4 py-6 text-center">
      <p class="text-white/80 text-sm">
        &copy; {today.getFullYear()} Tomorrow Guy - A local-first PWA
      </p>
      <div class="mt-2 text-xs text-white/60">
        Status: {isOnline ? "🟢 Online" : "🔴 Offline"} | Tasks: {todayTasks.length +
          tomorrowTasks.length} total
      </div>
    </div>
  </footer>
</div>
