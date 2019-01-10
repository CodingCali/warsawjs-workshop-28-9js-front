
var actualVersion = '1'


self.addEventListener('fetch',function (event) {



    if (event.request.url.endsWith('.jpg')
        ||event.request.url.endsWith('.jpeg')
        ||event.request.url.endsWith('.gif')
        ||event.request.url.endsWith('.png')
    ){
        event.respondWith(
            fetch(`/image/nointernet.gif`).then(response=>{

                return response
            })
        )
    }

})