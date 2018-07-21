
var apiKey = "973722cd55edcaaf54fc3f29432be2a4";
var artist = "";
var beginDate = "2018-09-09";
var endDate = "2018-10-10";
var queryURL = "";

var config = {
    apiKey: "AIzaSyDDNtVSjhQv8pEk7ZKDJNaPlBu0jeBZHpQ",
    authDomain: "bandsintownapp.firebaseapp.com",
    databaseURL: "https://bandsintownapp.firebaseio.com",
    projectId: "bandsintownapp",
    storageBucket: "",
    messagingSenderId: "834818398888"
  };
  firebase.initializeApp(config);

  var database = firebase.database()


$(".find-em-btn").on("click" , function(){
    event.preventDefault();

    artist = $(".band-name").val();
    beginDate = $(".start-date").val();
    endDate = $(".end-date").val();

    console.log(artist);
    console.log(beginDate);
    console.log(endDate);
    console.log(typeof(endDate))

    queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + apiKey; + "&date=" + beginDate + "%2C" + endDate;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        console.log(response);
    
        console.log(queryURL);

        var location = "";
        var date = "";
        var time = "";
        var tickets = "";
        var vanueName = "";
        var latitude = "";
        var longitude = "";
        var lineup =[];



        for(i = 0 ; i < response.length ; i ++){
            location = response[i].venue.city + ", " + response[i].venue.region;
            date = response[i].datetime.slice(0,10);
            time = response[i].datetime.slice(11,16);
            tickets = response[i].offers[0].status;
            venueName = response[i].venue.name;
            latitude = response[i].venue.latitude;
            longitude = response [i].venue.longitude;
            lineup = response[i].lineup;

            console.log("Location " + [i + 1] + ": " + location );
            console.log("Date " + [i + 1] + ": " + date );
            console.log("Time " + [i + 1] + ": " + time );
            console.log("Tickets " + [i + 1] + ": " + tickets );
            console.log("Venue Name " + [i + 1] + ": " + venueName );
            console.log("Latitude " + [i + 1] + ": " + latitude );
            console.log("Longitude " + [i + 1] + ": " + longitude );
            console.log("Lineup " + [i + 1] + ": " + lineup );

            database.ref().push({
                band: artist,
                location: location,
                date: date,
                time: time,
                tickets: tickets,
            })
        };

    });

});




