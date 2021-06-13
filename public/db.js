//declares db to be changed later
let db;
//Opens indexedDB
const request = indexedDB.open("budget", 1);

//Notifies user when db has been upgraded to a newer version, assigns db a value, and checks to see if there is an Object Store if not then one is created
request.onupgradeneeded = event => {
    const { oldVersion } = event;
    const newVersion = event.newVersion || db.version;

    console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);

    const db = event.target.result;

    if(db.objectStoreNames.length === 0) {
        db.createObjectStore('BudgetStore', {
            autoincrement: true
        });
    }
};

//run this code if indexedDB opens successfully
request.onsuccess = ({target}) => {
    db = target.result;

    //checks if app is online before reading the database
    if (navigator.onLine) {
        checkDatabase();
    }
};

function checkDatabase() {
    //open a transaction on BudgetStore database
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
}
