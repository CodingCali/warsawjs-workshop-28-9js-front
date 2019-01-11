import idb from "idb";

export const dbPromise = idb.open('9JS', 1, upgradeDB => {
    var db = upgradeDB.createObjectStore('posts',{keyPath: 'id'});

    upgradeDB.createObjectStore('posts-fav',{keyPath: 'id'});

    upgradeDB.createObjectStore('send-request',{keyPath: 'id', autoIncrement: true});


    db.createIndex("by-date","createdAt")
    db.createIndex("by-likes","likes")
});