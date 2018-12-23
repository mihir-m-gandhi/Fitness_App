var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedActivitiesArea = document.querySelector('#sharedActivitiesArea');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if(deferredPrompt){	//to check if deferredPrompt is set
  	deferredPrompt.prompt();

  	deferredPrompt.userChoice.then(function(choiceResult){		//checking the output
  		if(choiceResult.outcome==='dismissed'){
  			console.log('User cancelled installation');
  		}
  		else{
  			console.log('User added to home screen');
  		}
  	});
  	deferredPrompt = null;
  }

  // code for unregistering a service worker
  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.getRegistrations()
  //     .then(function(registrations) {
  //       for (var i = 0; i < registrations.length; i++) {
  //         registrations[i].unregister();
  //       }
  //     })
  // }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

//for cache on demand
// function onSaveButtonClicked(event){
//   console.log('clicked');
//   if('caches' in window){
//     caches.open('user-requested')
//     .then(function(cache){
//       cache.add('https://httpbin.org/get');
//       cache.add('/src/images/diet1.jpg');
//     });
//   }
// }

function clearCards() {
  while(sharedActivitiesArea.hasChildNodes()) {
    sharedActivitiesArea.removeChild(sharedActivitiesArea.lastChild);
  }
}

function createCard() {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("/src/images/diet1.jpg")';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'white';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = 'Healthy Diet';
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'Choose healthy';
  cardSupportingText.style.textAlign = 'center';
  //code for cache on demand
  // var cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedActivitiesArea.appendChild(cardWrapper);
}

// implementing cache then network strategy
var url = 'https://httpbin.org/post';
var networkDataReceived = false;

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    message: 'Some message'
  })
})
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    clearCards();
    createCard();
  });

if ('caches' in window) {
  caches.match(url)
    .then(function(response) {
      if (response) {
        return response.json();
      }
    })
    .then(function(data) {
      console.log('From cache', data);
      if (!networkDataReceived) {
        clearCards();
        createCard();
      }
    });
}

// fetch('https://httpbin.org/get')
//   .then(function(res) {
//     return res.json();
//   })
//   .then(function(data) {
//     createCard();
//   });
