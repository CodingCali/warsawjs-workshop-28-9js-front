
var actualVersion = '1'


self.addEventListener('fetch',function (event) {


    event.respondWith(
        fetch(`/image/nointernet.gif`).then(response=>{

            return response
        })
    )

})