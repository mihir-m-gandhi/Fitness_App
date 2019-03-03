importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

var CACHE_STATIC_NAME = 'static-v8';		//change these versions when some files are changed
var CACHE_DYNAMIC_NAME = 'dynamic-v3';

var STATIC_FILES = [
    "/",
    "index.html"


];  

self.addEventListener('install', function(event){
	console.log('[Service Worker] Installing service worker...', event);
	event.waitUntil(caches.open(CACHE_STATIC_NAME)		//returns a promise
		.then(function(cache) {
			console.log('[Service worker] Precaching app shell');
			cache.addAll(STATIC_FILES);		
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

self.addEventListener('fetch', function (event) {

//   var url = 'https://fitness-app-b7baa.firebaseio.com/posts';
//   if (event.request.url.indexOf(url) > -1) {
//     event.respondWith(fetch(event.request)
//             .then(function (res) { 
//               var clonedRes = res.clone();
//               clearAllData('posts')
//                 .then(function(){
//                   return clonedRes.json()  //returns a promise
//                 })
//                 .then(function(data){
//                     for(var key in data){
//                       writeData('posts', data[key]);
//                     }
//                 }); 
//               return res;
//             })
//           );
//   } else if (isInArray(event.request.url, STATIC_FILES)) {
//     event.respondWith(
//       caches.match(event.request)
//     );
//   } else {
//     event.respondWith(
//       caches.match(event.request)
//         .then(function (response) {
//           if (response) {
//             return response;
//           } else {
//             return fetch(event.request)
//               .then(function (res) {
//                 return caches.open(CACHE_DYNAMIC_NAME)
//                   .then(function (cache) {
//                     // trimCache(CACHE_DYNAMIC_NAME, 3);
//                     cache.put(event.request.url, res.clone());
//                     return res;
//                   })
//               })
//               .catch(function (err) {
//                 return caches.open(CACHE_STATIC_NAME)
//                   .then(function (cache) {
//                     if (event.request.headers.get('accept').includes('text/html')) {
//                       return cache.match('/offline.html');
//                     }
//                   });
//               });
//           }
//         })
//     );
//   }
});

// self.addEventListener('fetch', function(event){
// 	event.respondWith(
// 		caches.match(event.request)		//key is always a request, match to search for that key in the entire cache
// 			.then(function(response){
// 				if(response){	//if it is not cached, then response=null
// 					return response;
// 				}else{
// 					return fetch(event.request)
// 						.then(function(res){
// 							return caches.open(CACHE_DYNAMIC_NAME)
// 								.then(function(cache){
// 									cache.put(event.request.url, res.clone()); 	//as a response can be used only once and is then consumed
// 									return res;		//to make sure that a response is sent for the first time when the resource is not in cache as well
// 								})
// 						})
// 						//if we cant't retrieve the required resource, then display fallback page
// 						.catch(function(err){
// 							return caches.open(CACHE_STATIC_NAME)
// 								.then(function(cache){
// 									return cache.match('/offline.html');
// 								});
// 						});
// 				}
// 			})
// 	);
// });	

//Network with cache fallback
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function(res) {
//         return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//       })
//       .catch(function(err) {
//         return caches.match(event.request);
//       })
//   );
// });

// Cache-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//   );
// });

// Network-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//   );
// });



