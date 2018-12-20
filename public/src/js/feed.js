var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

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
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
