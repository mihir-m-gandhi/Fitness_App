var deferredPrompt; 

if(!window.Promise){
	window.Promise = Promise;
}

if('serviceWorker' in navigator){
	navigator.serviceWorker
	 	.register('/sw.js')		//.register('/sw.js', {scope: '/help/'}) to override the default scope and set it to only help folder, but only inside the default one, not outside
	 	.then(function(){
	 		console.log('Service worker registered');
	 	}).catch(function(){
	 		console.log('Service worker could not be registered');
	 	});
}

window.addEventListener('beforeinstallprompt', function(event){
	console.log('beforeinstallprompt fired');
	event.preventDefault();
	deferredPrompt = event;
	return false;
}); 