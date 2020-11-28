
self.addEventListener('install', function(event) {
    self.skipWaiting();
	console.log("azService installed ")	
	console.info('Event: Activate');
  
});

// self.addEventListener('activate', function(event) {
//   console.log("azService Active")
//     event.waitUntil(
//         self.clients.claim(),
//         caches.keys().then((cacheNames) => {
//             return Promise.all(
//                 cacheNames.map((cache) => {
//                     if (cache !== cacheName) {
//                         return caches.delete(cache);
//                     }
//                 })
//             );
//         })
//     );
// });


self.addEventListener('message', function(event){	
	try{			
		let mess=JSON.parse(event.data)	
		console.log("service got mess:",mess)		

	}catch(e){
		console.log("worker service MESS error",e)
		return;
	}
})


self.addEventListener('fetch', function(event) {
	
      var requestUrl = new URL(event.request.url);
      
      if (requestUrl.pathname.indexOf('/AzAffect')==0){
       //  event.respondWith("OK",{ status: 200,statusText: 'OK',headers: {'Content-Type': 'html/text'}});    
       
         let affectKey=requestUrl.pathname.split("/")[2];
         console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzz fetch affect",affectKey)
         sendMess({sessionAffectKey:affectKey});
      }
      
    //console.log("azservice intercept urlx:",requestUrl)
    return;	
	if(event.request.method!='GET'){return;}
 
});

function sendMess(...args){				
  self.clients.matchAll().then(function(clients) {
      clients.forEach(function(client) {    
        client.postMessage(JSON.stringify(args));
      });
    });
}