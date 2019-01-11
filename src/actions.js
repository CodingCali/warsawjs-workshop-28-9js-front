
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
                    callback()
                } else {
                    //remove favourite
                    db.transaction('posts-fav', 'readwrite')
                        .objectStore('posts-fav')
                        .delete(postData.data.id)
                    callback()
                }
            })


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
                    return
                })
                return listFacouriteId
            })
    })
}