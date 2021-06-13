//declares db and budgetVersion variables for use later
let db;
let budgetVersion;

//create a new db request for a "budget" database
const request = indexedDB.open('budget', budgetVersion || 1);

//Notifies user when db has been upgraded to a newer version, assigns db a value, and checks to see if there is an Object Store if not then one is created
request.onupgradeneeded = event => {
    console.log('Upgrade needed in IndexedDB');

    const { oldVersion } = event;
    const newVersion = event.newVersion || db.version;

    console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);

    const db = event.target.result;

    //if there is no length in database's objectStoreNames then create a new object store
    if(db.objectStoreNames.length === 0) {
        db.createObjectStore('BudgetStore', {
            autoincrement: true
        });
    }
};

//log response when there is an error upon opening indexedDB
request.onerror = function(err) {
    console.log(`Whoops! ${err.target.errorCode}`);
};

//run this code if indexedDB opens successfully
request.onsuccess = ({target}) => {
    console.log('Success!');
    
    db = target.result;

    //checks if app is online before reading the database
    if (navigator.onLine) {
        checkDatabase();
    }
};

//saves new record to indexedDB
function saveRecord(record) {
    //create a transaction on the BudgetStore db with readwrite access
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
    //access BudgetStore object store
    const store = transaction.objectStore('BudgetStore');
    //add record to store with add method
    store.add(record);
};

//when online grab the records from indexedDB and send to MongoDB
function checkDatabase() {
    //open a transaction on BudgetStore database
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
    //accesses the BudgetStore object store
    const store = transaction.objectStore('BudgetStore');
    //get all records from the store and assign to the variable getAll
    const getAll = store.getAll();

    //on success of getting all records from the store run this function
    getAll.onsuccess = function() {
        //if the results of getting all the records has a length do a fetch request to POST into the app's mongoDB
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then((res) => {
                //if our returned object is not empty
                if(res.length !== 0) {
                    //open another transaction to BudgetStore with the ability to read and write
                    transaction = db.transaction(['BudgetStore'], 'readwrite');
                    //assign the current store to a variable
                    const store = transaction.objectStore('BudgetStore');
                    //clear existing entries because our bulk add was successful to app's mongoDB
                    store.clear();
                }
            });
        }
    };
};

//listening for app coming back online, and when it is call checkDatabase function
window.addEventListener('online', checkDatabase);
