//declares db to be changed later
let db;
//Opens indexedDB
const request = indexedDB.open("budget", 1);

//run this code if indexedDB opens successfully
request.onsuccess = ({target}) => {
    db = target.result;
}