var config = {
    apiKey: "AIzaSyDDNtVSjhQv8pEk7ZKDJNaPlBu0jeBZHpQ",
    authDomain: "bandsintownapp.firebaseapp.com",
    databaseURL: "https://bandsintownapp.firebaseio.com",
    projectId: "bandsintownapp",
    storageBucket: "bandsintownapp.appspot.com",
    messagingSenderId: "834818398888"
  };
  firebase.initializeApp(config);

  var database = firebase.database()

  database.ref().on("child_added", function (snapshot) {
  
    var newEventRow = $("<tr>");
    var newLocationCol = $("<td>");
    var newDateCol = $("<td>");
    var newTimeCol = $("<td>");
    var newTicketsCol = $("<td>");

    newLocationCol.text(snapshot.val().location);
    newDateCol.text(snapshot.val().date);
    newTimeCol.text(snapshot.val().time);
    newTicketsCol.text(snapshot.val().tickets);
 
    newEventRow.append(newLocationCol);
    newEventRow.append(newDateCol);
    newEventRow.append(newTimeCol);
    newEventRow.append(newTicketsCol);

    $(".band-store").append(newEventRow);
  
    // If any errors are experienced, log them to console.
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });