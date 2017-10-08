if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    var config = {
        apiKey: "AIzaSyCyz-OvL_NXg-Lsjnqc015ofFCcFAKcclQ",
        authDomain: "rps-multiplayer-bc526.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-bc526.firebaseio.com",
        projectId: "rps-multiplayer-bc526",
        storageBucket: "",
        messagingSenderId: "932333388322"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    database.ref().set({
        test: "this is a test"
    });
}