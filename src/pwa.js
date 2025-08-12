import { Workbox } from 'workbox-window';

if ('serviceWorker' in navigator) {
	const wb = new Workbox('/sw.js');

	wb.addEventListener('installed', (event) => {
		if (event.isUpdate) {
			// Show update available notification
			console.log('App updated! Refresh to get the latest version.');
		} else {
			// Show app is ready for offline use
			console.log('App is ready for offline use.');
		}
	});

	wb.addEventListener('waiting', (event) => {
		// Show update prompt
		if (confirm('New version available! Click OK to update.')) {
			wb.messageSkipWaiting();
		}
	});

	wb.addEventListener('controlling', (event) => {
		window.location.reload();
	});

	wb.register();
}
