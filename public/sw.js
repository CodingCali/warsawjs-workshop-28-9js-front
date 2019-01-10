
var actualVersion = '1'

self.addEventListener('install', function(event) {
    caches.open('storage-'+actualVersion).then((cacheOpened) => {

        return cacheOpened.addAll([
            '/image/nointernet.gif'
        ])}
    )
});

self.addEventListener('fetch',function (event) {

        event.respondWith(
            caches.match('/image/nointernet.gif')
        )


    // if (event.request.url.endsWith('.jpg')
    //     ||event.request.url.endsWith('.jpeg')
    //     ||event.request.url.endsWith('.gif')
    //     ||event.request.url.endsWith('.png')
    // ){
    //     event.respondWith(
    //         fetch(`/image/nointernet.gif`).then(response=>{
    //
    //             return response
    //         })
    //     )
    // }


})