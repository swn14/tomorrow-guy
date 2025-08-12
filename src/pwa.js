// PWA functionality - works with vite-plugin-pwa
if ("serviceWorker" in navigator) {
  // The service worker is automatically registered by vite-plugin-pwa
  // We just need to handle the update logic here

  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    window.deferredPrompt = e;
  });

  // Listen for app installed
  window.addEventListener("appinstalled", () => {
    console.log("PWA was installed");
    window.deferredPrompt = null;
  });

  // Register SW update listener
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "SKIP_WAITING") {
        window.location.reload();
      }
    });
  }
}
