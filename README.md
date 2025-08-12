# Tomorrow Guy - Svelte 5 PWA

A simple "Hello World" Progressive Web App built with Svelte 5 and SvelteKit.

## Features

- ✅ Svelte 5 with runes
- ✅ Progressive Web App (PWA) support
- ✅ Offline functionality
- ✅ Install prompt for mobile/desktop
- ✅ Responsive design
- ✅ Online/offline status indicator
- ✅ Service worker with automatic updates

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and visit `http://localhost:5173`

4. To test PWA features:
   - Build the project: `npm run build`
   - Preview the build: `npm run preview`
   - Open DevTools > Application > Service Workers to see PWA features

## Building for Production

```bash
npm run build
```

The static files will be generated in the `build` directory, ready to be deployed to any static hosting service.

## PWA Features

- **Offline Support**: The app works offline thanks to service worker caching
- **Install Prompt**: Users can install the app on their device
- **App Manifest**: Provides metadata for the PWA
- **Responsive**: Works on desktop, tablet, and mobile devices

## Project Structure

```
src/
  routes/
    +page.svelte    # Main page component
  app.html          # HTML template
  pwa.js           # PWA service worker registration
static/
  manifest.webmanifest  # PWA manifest
  *.png            # App icons
package.json
svelte.config.js   # Svelte configuration
vite.config.js     # Vite configuration with PWA plugin
```
