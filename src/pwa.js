// PWA functionality - works with vite-plugin-pwa
if ("serviceWorker" in navigator) {
  // The service worker is automatically registered by vite-plugin-pwa
  // We just need to handle the update logic here

  // @ts-check
  // PWA functionality
  let deferredPrompt;

  // Handle PWA install prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the default browser install prompt
    e.preventDefault();

    // Store the event for later use
    deferredPrompt = e;
    /** @type {any} */ (window).deferredPrompt = e;
  });

  // Listen for app installed
  window.addEventListener("appinstalled", () => {
    console.log("PWA was installed");
    /** @type {any} */ (window).deferredPrompt = null;
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
