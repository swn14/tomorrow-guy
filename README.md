# Tomorrow Guy - Local-First Task Management PWA

![CI](https://github.com/swn14/tomorrow-guy/workflows/CI/badge.svg)
![Deploy](https://github.com/swn14/tomorrow-guy/workflows/Build%20and%20Deploy%20to%20GitHub%20Pages/badge.svg)

**Feeling overwhelmed? Make it Tomorrow Guy's problem!**

A local-first Progressive Web App built with Svelte 5 that helps you manage tasks with a unique twist - delegate overwhelming tasks to "Tomorrow Guy" and let the app automatically move them back when the next day arrives.

## 🎯 Core Concept

- **Today Guy** handles your current tasks with visual stress indicators
- **Tomorrow Guy** takes care of future worries
- **Automatic midnight transfer** moves tomorrow's tasks to today
- **Stress-based pixel art characters** show your current workload status

## ✨ Features

### Task Management

- ✅ **Dual-list system** - Today Guy vs Tomorrow Guy
- ✅ **Smart task delegation** - Move overwhelming tasks to tomorrow
- ✅ **Automatic midnight transfer** - Tomorrow's tasks become today's tasks
- ✅ **Manual task moving** - Force move tasks when needed
- ✅ **Task completion tracking** - Check off completed items
- ✅ **Persistent storage** - All data saved locally with ElectricSQL

### Visual Feedback

- ✅ **Stress-level indicators** - Characters change based on incomplete tasks
- ✅ **Pixel art characters** - Happy 😊 → Concerned 😐 → Stressed 😰 → Overwhelmed 😵‍💫
- ✅ **Dynamic backgrounds** - Color-coded stress levels
- ✅ **Real-time notifications** - Toast messages for task moves

### Technical Excellence

- ✅ **Svelte 5 with runes** - Latest Svelte features with reactive state
- ✅ **Local-first architecture** - ElectricSQL + wa-sqlite for offline-first data
- ✅ **Progressive Web App** - Install on any device, works offline
- ✅ **Responsive design** - Beautiful on desktop, tablet, and mobile
- ✅ **Type safety** - Full TypeScript support

- ✅ **Modern styling** - TailwindCSS with smooth animations

### Developer Experience

- ✅ **GitHub Actions CI/CD** - Automated testing and deployment
- ✅ **Automated releases** - Version tagging creates GitHub releases
- ✅ **Dependency management** - Dependabot keeps packages updated
- ✅ **Code quality** - Type checking and linting

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser** and visit `http://localhost:5173`

4. **Test local-first features:**
   - Add some tasks and increment the counter
   - Refresh the page - your data persists!
   - Go offline - everything still works
   - Install as PWA for native app experience

## Building for Production

```bash
npm run build
```

The static files will be generated in the `build` directory, ready to be deployed to any static hosting service.

## 🏗️ Architecture & Technology Stack

### Local-First with ElectricSQL

This app demonstrates a modern local-first architecture:

- **ElectricSQL + wa-sqlite** - Local database with sync capabilities
- **Offline-first design** - Works completely without internet

- **Instant interactions** - No network latency for any operation
- **Data persistence** - Survives app restarts, browser refreshes, and device reboots
- **Future-ready** - Architecture supports multi-device sync when needed

### Key Technologies

- **Svelte 5** - Modern reactive framework with runes
- **SvelteKit** - Full-stack framework with static adapter
- **TypeScript** - Type safety throughout the application
- **TailwindCSS** - Utility-first styling with custom animations
- **Vite** - Fast build tool with PWA plugin
- **ElectricSQL** - Local-first database layer
- **GitHub Actions** - CI/CD pipeline with automated deployment

## 📁 Project Structure

```bash
src/
  lib/
    electric.js       # ElectricSQL database setup and operations
    stores.js         # Svelte stores with task management logic
  routes/
    +page.svelte      # Main app UI with dual-column layout
  app.html            # HTML template with PWA configuration
  pwa.js             # PWA functionality and service worker handling
static/
  manifest.webmanifest  # PWA manifest with app metadata
  pwa-*.png          # App icons for different sizes
  favicon.ico        # Browser favicon
.github/
  workflows/         # GitHub Actions for CI/CD
    deploy.yml       # Build and deploy to GitHub Pages
    ci.yml          # Continuous integration testing
    release.yml     # Automated releases

  dependabot.yml    # Automated dependency updates
```

## 📊 Data Model

### Tasks

```typescript
interface Task {
  id: string; // UUID v4
  title: string; // User-entered task title
  description: string; // Optional task description
  completed: boolean; // Completion status

  list: "today-guy" | "tomorrow-guy"; // Which list the task belongs to
  created_at: number; // Unix timestamp
  updated_at: number; // Unix timestamp
}
```

### App State

```typescript
interface AppState {
  id: string; // State identifier
  counter_value?: number; // For the counter feature

  last_move_date?: string; // Date string for tracking midnight moves

  updated_at: number; // Unix timestamp
}
```

## 🎮 How It Works

### Stress Level System

The app calculates stress levels based on incomplete tasks in Today Guy:

- **0 tasks**: Happy 😊 (Green) - "Living stress-free!"
- **1-2 tasks**: Concerned 😐 (Yellow) - "Manageable workload"

- **3-5 tasks**: Stressed 😰 (Orange) - "Getting busy!"

- **6+ tasks**: Overwhelmed 😵‍💫 (Red) - "Time to delegate!"

### Automatic Midnight Transfer

- Timer calculates milliseconds until next midnight
- At midnight, all Tomorrow Guy tasks automatically move to Today Guy
- Date tracking prevents multiple moves on the same day
- Manual move button available for testing/emergency situations

### Pixel Art Characters

Each stress level has a unique 16x16 pixel art character:

- Dynamically generated SVG graphics
- Responsive to current workload
- Smooth color transitions between states

## 🚀 Deployment

This app is automatically deployed using GitHub Actions:

- **Live Demo**: [https://swn14.github.io/tomorrow-guy/](https://swn14.github.io/tomorrow-guy/)
- **Auto-deployment**: Every push to `main` branch triggers a new deployment
- **Manual deployment**: Available through GitHub Actions workflow dispatch

### Deployment Features

- ✅ **GitHub Pages hosting** - Free static hosting
- ✅ **Automated builds** - CI/CD pipeline with type checking
- ✅ **PWA optimization** - Service worker and manifest generation
- ✅ **Asset optimization** - Compressed and optimized static assets
- ✅ **Release management** - Automated releases with version tagging

## 🛠️ Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Local Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/swn14/tomorrow-guy.git
   cd tomorrow-guy
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser** and visit `http://localhost:5174`

5. **Test the features:**
   - Add tasks to Today Guy and Tomorrow Guy
   - Watch the stress levels change with pixel art
   - Use the manual move button to test task transfers
   - Try the PWA installation (install button in browser)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run check        # Type checking with TypeScript
npm run check:watch  # Watch mode for type checking
```

### Production Build

```bash
npm run build
```

The static files will be generated in the `build` directory, optimized and ready for deployment to any static hosting service.

## 🔮 Future Roadmap

### Planned Features

- 📱 **Mobile app versions** - Native iOS and Android apps
- 🔄 **Multi-device sync** - Sync tasks across all your devices
- 🏷️ **Task categories** - Organize tasks with tags and categories
- ⏰ **Custom timing** - Set custom times for task transfers
- 📊 **Analytics dashboard** - Track productivity and stress patterns
- 🎨 **Themes** - Customizable color schemes and characters
- 🔔 **Smart notifications** - Reminders and productivity insights

### Technical Improvements

- 🔐 **End-to-end encryption** - Secure sync with zero-knowledge architecture
- 🌐 **i18n support** - Multiple language support
- 📱 **Enhanced PWA** - Better mobile experience and native features
- ⚡ **Performance optimization** - Faster loading and smoother animations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

- Follow TypeScript best practices
- Maintain test coverage for new features
- Use conventional commit messages
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Svelte 5](https://svelte.dev/) and [SvelteKit](https://kit.svelte.dev/)
- Local-first architecture powered by [ElectricSQL](https://electric-sql.com/)
- Styling with [TailwindCSS](https://tailwindcss.com/)
- Deployed on [GitHub Pages](https://pages.github.com/)

---

**Remember: When life gets overwhelming, just make it Tomorrow Guy's problem!** 🚀
