self.addEventListener('install', function(event){
	console.log('[Service Worker] Installing service worker...', event);
});

self.addEventListener('activate', function(event){
	console.log('[Service Worker] Activating service worker...', event);
	return self.clients.claim();	//to make it more robust, sometimes absense of this line causes errors
});	

self.addEventListener('fetch', function(event){
	console.log('[Service Worker] Fetching something...', event);
	event.respondWith(fetch(event.request));
});	