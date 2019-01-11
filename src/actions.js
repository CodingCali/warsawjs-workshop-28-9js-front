
import {dbPromise} from './idb';

export const favouriteClick = (postData, callback=()=>{} )=>{
    dbPromise.then(db=> {
        db.transaction('posts-fav')
            .objectStore('posts-fav')
            .get(postData.data.id)
            .then((res) => {

                //favourite not exist
                if (res === undefined) {
                    db.transaction('posts-fav', 'readwrite')
                        .objectStore('posts-fav')
                        .put({
                            id: postData.data.id,
                            createdAt: postData.createdAt,
                            likes: postData.likes,
                            data: postData.data
                        })
                    if(postData.data.type==='image')
                        addImageToSave(`${process.env.REACT_APP_SERVER_BACK}/images/${postData.data.src}`)
                    callback()
                } else {
                    //remove favourite
                    db.transaction('posts-fav', 'readwrite')
                        .objectStore('posts-fav')
                        .delete(postData.data.id)
                    if(postData.data.type==='image')
                        deleteImageFromCache(`${process.env.REACT_APP_SERVER_BACK}/images/${postData.data.src}`)
                    callback()
                }
            })


    })
}

//================================

export const addImageToSave = (image) => {
    window.caches.open('storage-posts').then((cache) => {
            cache.match(image)
                .then((res) => res || fetch(
                    `${image}`,
                    {
                        'method': 'GET'
                    }
                ).then((response) => {
                    cache.put(image, response.clone())
                }))

        }
    )
}
export const deleteImageFromCache = (image) => {
    window.caches.open('storage-posts').then(function(cache) {
        cache.delete(image)
    })
}

//=========================

export const getFavouriteIdInMap = ()=>{
    return dbPromise.then(db => {
        return db.transaction('posts-fav')
            .objectStore('posts-fav')
            .getAll()
            .then(item=>{
                var listFacouriteId = new Map()
                item.map(elem=>{
                    listFacouriteId.set(elem.id, true)
                    return false
                })
                return listFacouriteId
            })
    })
}