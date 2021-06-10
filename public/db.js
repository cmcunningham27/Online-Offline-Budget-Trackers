//declares db to be changed later
let db;
//Opens indexedDB
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = event => {
    const { oldVersion } = event;
    const newVersion = event.newVersion || db.version;

    console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);
}

//run this code if indexedDB opens successfully
request.onsuccess = ({target}) => {
    db = target.result;
};
