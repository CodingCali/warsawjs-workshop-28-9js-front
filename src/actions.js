
import {dbPromise} from './idb';

export const favouriteClick = (postData, ) =>{
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
                } else {
                    //remove favourite
                    db.transaction('posts-fav', 'readwrite')
                        .objectStore('posts-fav')
                        .delete(postData.data.id)
                }
            })


    })
}