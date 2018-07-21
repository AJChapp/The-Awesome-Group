var apiKey = "973722cd55edcaaf54fc3f29432be2a4";
var artist = "Maroon 5";
var beginDate = "2018-09-09";
var endDate = "2018-10-10";
var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + apiKey; + "&date=" + beginDate + "%2C" + endDate;
var googleURL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB3Kp0Vsql9BI3aWtF7DzoP1Oja0ZZjWt8"



$.ajax({
    url: queryURL,
    method: "GET"
})
    .then(function (response) {
        console.log(response);


        $.ajax({
            url: googleURL,
            method: "GET",
            dataType: 'jsonp'

        }).then(function () {
            console.log(response)
            for(i=0;i<response.length; i++){
                var map;
                var newP = '';
                var venueData = response[i].venue
                var x = parseFloat(venueData.latitude);
                var y = parseFloat(venueData.longitude);
                console.log(venueData.latitude)
                console.log(venueData.longitude)
                map = new google.maps.Map(document.getElementById('map'+i), {
                    center: { lat: x, lng: y },
                    zoom: 15
                });
            }

        })



    });



