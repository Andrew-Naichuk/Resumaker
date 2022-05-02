// Defining config params for our Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCvcjamqo5ARPJdiBHtRe_ChLyCgrCIuOs",
    authDomain: "uixo-ef7de.firebaseapp.com",
    projectId: "uixo-ef7de",
    storageBucket: "uixo-ef7de.appspot.com",
    messagingSenderId: "662624469900",
    appId: "1:662624469900:web:f2a2af3244b34b91a90ca9"
};

// Initializing Firebase
firebase.initializeApp(firebaseConfig);

// Defining objexts for auth and database
const auth = firebase.auth();
const db = firebase.firestore();

// Prescribing provider used to conduct auth
const provider = new firebase.auth.GoogleAuthProvider();

// Getting the elements of the DOM
const resume = document.querySelector('.mainContainer');
const editWindow = document.querySelector('.editWindow');
const editField = document.querySelector('#editField');
const editSave = document.querySelector('#saveEdit');
const cancelEdit = document.querySelector('#cancelEdit');
const deleteBtn = document.querySelector('#delete');
const logBtn = document.querySelector('#logBtn');
const outBtn = document.querySelector('#outBtn');
const saveBtn = document.querySelector('#savePDF');
const publishBtn = document.querySelector('#publish');
const welcome = document.querySelector('#welcome');
const controls = document.querySelector('.controls');
const userName = document.querySelector('#userName');
const userImage = document.querySelector('#userImage');

// Creating variables for current edit element, current user and default resume content
let editElement;
let currentUser;
const defaultContent = resume.innerHTML;

// Function to update resume for current user
async function updateCV() {
    snapshot = await db.collection("users").get();
    snapshot.forEach(doc => {
        if (doc.data().userID == currentUser) {
            resume.innerHTML = doc.data().resumeContent;
        }
    })
};

// Sign In button function
logBtn.onclick = async () => {
    await auth.signInWithPopup(provider);
};

// Sign Out button function
outBtn.onclick = async () => {
    await auth.signOut();
};

// Listening to the status of auth to change content
auth.onAuthStateChanged(user =>{
    if (user) {
        currentUser = user.uid;
        updateCV();

        editWindow.style.display = 'flex';
        resume.style.display = 'flex';
        welcome.style.display = 'none';
        controls.style.display = 'flex';
        outBtn.style.display = '';
        logBtn.style.display = 'none';
        userImage.style.display = '';
        userName.style.display = '';
        userImage.src = user.photoURL;
        userName.innerHTML = user.displayName;

    } else {
        currentUser = 'no user';
        resume.innerHTML = defaultContent;

        editWindow.style.display = 'none';
        resume.style.display = 'none';
        welcome.style.display = 'flex';
        controls.style.display = 'none';
        outBtn.style.display = 'none';
        logBtn.style.display = '';
        userImage.style.display = 'none';
        userName.style.display = 'none';
    }
});

// Editing resume content via modal window
resume.onclick = e => {
    if (e.target.tagName != 'DIV') {
        editWindow.style.zIndex = 10;
        editElement = e.target;
        if (editElement.innerText == '✍︎ Add new line') {
            editField.value = '';
        } else {
        editField.value = editElement.innerText;
        }
    }
};

// Updating resume content and closing modal window
editSave.onclick = e => {
    if (editField.value != '') {
        editElement.innerText = editField.value;
    } else {
        editElement.innerText = '✍︎ Add new line';
    }
    editWindow.style.zIndex = -10;
};

// Canceling resume content edit
cancelEdit.onclick = e => {
    editWindow.style.zIndex = -10;
};

// Deleting resume element
deleteBtn.onclick = e => {
    editElement.innerText = '✍︎ Add new line';
    editWindow.style.zIndex = -10;
};

// Processing save as PDF or print
saveBtn.onclick = e => {
    controls.style.display = 'none'
    window.print();
    controls.style.display = 'flex'
};

// Processing saving user resume on server
publishBtn.onclick = async () => {
    publishBtn.innerText = 'Saving...';
    await db.collection("users").doc(firebase.auth().currentUser.uid).set({
        userID: currentUser,
        resumeContent: resume.innerHTML
    });
    publishBtn.innerText = 'Saved!';
    setTimeout(() => publishBtn.innerText = 'Save on server', 2000);
};



