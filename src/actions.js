
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

//==================

export const voteForPost = (post, callback = ()=>{})=>{
    var likes = post.likes+1

    dbPromise.then(db=> {
        db.transaction('posts')
            .objectStore('posts')
            .get(post.id).then((res)=>{
            db.transaction('posts', 'readwrite')
                .objectStore('posts')
                .put({
                    id: post.id,
                    ...res,
                    likes: likes
                }).then(()=>callback())
            db.transaction('posts-fav', 'readwrite')
                .objectStore('posts-fav')
                .put({
                    id: post.id,
                    ...res,
                    likes: likes
                }).then(()=>callback())
        })
    })


    fetch(
        `${process.env.REACT_APP_SERVER_BACK}/posts/${post.id}`,
        {
            'method': 'PUT',
            headers: {  'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...post.data,
                likes: likes
            })
        }
    ).catch(()=>{
        saveRequest(
            `${process.env.REACT_APP_SERVER_BACK}/posts/${post.id}`,
            "PUT",
            {
                ...post.data,
                likes: likes
            }
        )
    })

}

//=====================


export const saveRequest = (url, method, body) => {
    dbPromise.then(db=> {
        db.transaction('send-request', 'readwrite')
            .objectStore('send-request')
            .put({
                url: url,
                method: method,
                body: JSON.stringify(body)
            });

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


//=====================


export const sendAllReguest = () => {
    dbPromise.then(db=> {
        db.transaction('send-request')
            .objectStore('send-request')
            .getAll().then((res)=>{
            res.map((item)=>{
                fetch(
                    item.url,
                    {
                        'method': item.method,
                        headers: {  'Content-Type': 'application/json' },
                        body: item.body
                    }
                )

                db.transaction('send-request', 'readwrite')
                    .objectStore('send-request')
                    .delete(item.id)


                return false
            })
        });
    })
}