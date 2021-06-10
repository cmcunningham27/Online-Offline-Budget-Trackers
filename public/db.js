//declares db to be changed later
let db;
//Opens indexedDB
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = event => {
    const { oldVersion } = event;
    const newVersion = event.newVersion || db.version;

    console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);

    db - event.target.result;

    if(db.objectStoreNames.length === 0) {
        db.createObjectStore('BudgetStore', {
            autoincrement: true
        });
    }
};

//run this code if indexedDB opens successfully
request.onsuccess = ({target}) => {
    db = target.result;
};
