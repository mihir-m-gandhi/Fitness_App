//initialization code
var dbPromise = idb.open('posts-store', 1, function(db){   //opening a new database, 1 is version
  if(!db.objectStoreNames.contains('posts')){
     db.createObjectStore('posts', {keyPath: 'id'});    //table name and primary key
  }
});

//function for writing data into indexed DB
function writeData(storeName, data){
	return dbPromise.
	    then(function(db){
	      var tx = db.transaction(storeName, 'readwrite');  //creating a transaction using name of store and type of operation
	      var store = tx.objectStore(storeName);  //opening the store
	      store.put(data);
	      return tx.complete;	//necessary for write operations
	    });  
}

//function for reading all items in indexed DB
function readAllData(storeName){
	return dbPromise
		.then(function(db){
			var tx = db.transaction(storeName, 'readonly');
			var store = tx.objectStore(storeName);
			return store.getAll();		//get(id) for reading single item
		});
}

//function for deleting all items in indexed DB
function clearAllData(storeName){
	return dbPromise
		.then(function(db){
			var tx = db.transaction(storeName, 'readwrite');
			var store = tx.objectStore(storeName);
			store.clear(); 
			return tx.complete;
		});
}

//function for deleting a single item in indexed DB by id
function deleteItem(storeName, id){
	return dbPromise
		.then(function(db){
			var tx = db.transaction(storeName, 'readwrite');
			var store = tx.objectStore(storeName);
			store.delete(id); 
			return tx.complete;
		})
		.then(function(){
			console.log('Item deleted');
		});
}