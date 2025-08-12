<script>
	import { onMount } from 'svelte';

	let count = $state(0);
	let isOnline = $state(navigator.onLine);
	let installPrompt = $state(null);
	let isInstalled = $state(false);

	function increment() {
		count++;
	}

	function decrement() {
		count--;
	}

	onMount(() => {
		// Register service worker for PWA
		if ('serviceWorker' in navigator) {
			import('/src/pwa.js');
		}

		// Handle online/offline status
		function updateOnlineStatus() {
			isOnline = navigator.onLine;
		}

		window.addEventListener('online', updateOnlineStatus);
		window.addEventListener('offline', updateOnlineStatus);

		// Handle PWA install prompt
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			installPrompt = e;
		});

		// Check if app is already installed
		window.addEventListener('appinstalled', () => {
			isInstalled = true;
			installPrompt = null;
		});

		// Check if running as PWA
		if (window.matchMedia('(display-mode: standalone)').matches) {
			isInstalled = true;
		}

		return () => {
			window.removeEventListener('online', updateOnlineStatus);
			window.removeEventListener('offline', updateOnlineStatus);
		};
	});

	async function installPWA() {
		if (installPrompt) {
			installPrompt.prompt();
			const { outcome } = await installPrompt.userChoice;
			if (outcome === 'accepted') {
				isInstalled = true;
			}
			installPrompt = null;
		}
	}
</script>

<svelte:head>
	<title>Tomorrow Guy - Svelte 5 PWA</title>
</svelte:head>

<main>
	<div class="container">
		<h1>🚀 Tomorrow Guy</h1>
		<p class="subtitle">A Svelte 5 PWA Hello World Example</p>
		
		<div class="status">
			<span class="status-indicator {isOnline ? 'online' : 'offline'}">
				{isOnline ? '🟢 Online' : '🔴 Offline'}
			</span>
			<span class="status-indicator {isInstalled ? 'installed' : 'not-installed'}">
				{isInstalled ? '📱 Installed as PWA' : '🌐 Running in Browser'}
			</span>
		</div>

		<div class="counter">
			<button onclick={decrement} class="btn">-</button>
			<span class="count">{count}</span>
			<button onclick={increment} class="btn">+</button>
		</div>

		<div class="features">
			<h2>✨ Features</h2>
			<ul>
				<li>✅ Svelte 5 with runes</li>
				<li>✅ Progressive Web App (PWA)</li>
				<li>✅ Offline support</li>
				<li>✅ Install prompt</li>
				<li>✅ Responsive design</li>
			</ul>
		</div>

		{#if installPrompt && !isInstalled}
			<button onclick={installPWA} class="install-btn">
				📱 Install App
			</button>
		{/if}
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
	}

	.container {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem;
		text-align: center;
		color: white;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 0.5rem;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}

	.subtitle {
		font-size: 1.2rem;
		margin-bottom: 2rem;
		opacity: 0.9;
	}

	.status {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.status-indicator {
		background: rgba(255, 255, 255, 0.2);
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.9rem;
		backdrop-filter: blur(10px);
	}

	.status-indicator.online {
		background: rgba(76, 175, 80, 0.3);
	}

	.status-indicator.offline {
		background: rgba(244, 67, 54, 0.3);
	}

	.status-indicator.installed {
		background: rgba(76, 175, 80, 0.3);
	}

	.counter {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		margin: 3rem 0;
	}

	.btn {
		background: rgba(255, 255, 255, 0.2);
		border: none;
		color: white;
		font-size: 2rem;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.2s ease;
		backdrop-filter: blur(10px);
	}

	.btn:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}

	.btn:active {
		transform: scale(0.95);
	}

	.count {
		font-size: 3rem;
		font-weight: bold;
		min-width: 100px;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}

	.features {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 15px;
		padding: 2rem;
		margin: 2rem 0;
		backdrop-filter: blur(10px);
	}

	.features h2 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.features ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.features li {
		padding: 0.5rem 0;
		font-size: 1.1rem;
	}

	.install-btn {
		background: #4CAF50;
		color: white;
		border: none;
		padding: 1rem 2rem;
		font-size: 1.1rem;
		border-radius: 25px;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
	}

	.install-btn:hover {
		background: #45a049;
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}
		
		h1 {
			font-size: 2rem;
		}
		
		.counter {
			gap: 1rem;
		}
		
		.count {
			font-size: 2rem;
		}
		
		.btn {
			width: 50px;
			height: 50px;
			font-size: 1.5rem;
		}
	}
</style>
