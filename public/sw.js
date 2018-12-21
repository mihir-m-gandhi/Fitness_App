var CACHE_STATIC_NAME = 'static-v3';		//change these versions when some files are changed
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function(event){
	console.log('[Service Worker] Installing service worker...', event);
	event.waitUntil(caches.open(CACHE_STATIC_NAME)		//returns a promise
		.then(function(cache) {
			console.log('[Service worker] Precaching app shell');
			cache.addAll([
				'/',	//for direct request to our URL
				'index.html',
				'/src/js/app.js',
				'/src/js/feed.js',
				'/src/js/promise.js',	//only needed on older browsers which probably don't support sw, but we still cache them to imoprove performance
				'/src/js/fetch.js',
				'/src/js/material.min.js',
				'/src/css/app.css',
				'/src/css/feed.css',
				'src/images/main-image.jpg',	//icons not necessary as they don't matter much
				'https://fonts.googleapis.com/css?family=Roboto:400,700',	//this server should set CORS headers to allow cross origin resource sharing, else error
				'https://fonts.googleapis.com/icon?family=Material+Icons',
				'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
			]);		
		})
	)		//open or create subcache within the single cache that we have
	//wait for caching to be completed before proceeding
});

self.addEventListener('activate', function(event){
	console.log('[Service Worker] Activating service worker...', event);
	//cache cleanup code
	event.waitUntil(
		caches.keys()	//returns a list of keys
			.then(function(keyList){	
				return Promise.all(keyList.map(function(key){	//map transforms an array of strings to array of promises 
					if(key!==CACHE_STATIC_NAME && key!==CACHE_DYNAMIC_NAME){
						console.log('[Service Worker] Removing old cache', key);
						return caches.delete(key);
					}
				}));
			})
	);
	return self.clients.claim();	//to make it more robust, sometimes absense of this line causes errors
});	

self.addEventListener('fetch', function(event){
	event.respondWith(
		caches.match(event.request)		//key is always a request, match to search for that key in the entire cache
			.then(function(response){
				if(response){	//if it is not cached, then response=null
					return response;
				}else{
					return fetch(event.request)
						.then(function(res){
							return caches.open(CACHE_DYNAMIC_NAME)
								.then(function(cache){
									cache.put(event.request.url, res.clone()); 	//as a response can be used only once and is then consumed
									return res;		//to make sure that a response is sent for the first time when the resource is not in cache as well
								})
						})
						.catch(function(err){

						});
				}
			})
	);
});	
