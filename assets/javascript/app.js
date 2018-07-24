//variables declared to use for APIs

var apiKey = "973722cd55edcaaf54fc3f29432be2a4";
var artist = "";
var beginDate = "";
var endDate = "";
var bitEventsURL = "";
var bitArtistInfoURL = "";
var googleURL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB3Kp0Vsql9BI3aWtF7DzoP1Oja0ZZjWt8"


//button click event to initiate search
$(".find-em-btn").on("click" , function(){

    //ensures the target div is emptied for each search
    $("#target").empty();
    var plzWork = []
    //prevents page refresh on button click
    event.preventDefault();

    //pulls input from user
    artist = $(".band-name").val();
    beginDate = $(".start-date").val();
    endDate = $(".end-date").val();

    //console log for test, delete before final push!!
    console.log(artist);
    console.log(beginDate);
    console.log(endDate);
    console.log(typeof(endDate))

    //creation of URL for event call
    bitEventsURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + apiKey + "&date=" + beginDate + "%2C" + endDate;

    //creation of URL for artist info call
    bitArtistInfoURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=" + apiKey;
    
    //If / else statement so that if field is left empty user will be alerted and there will be no search initiated. **USE SWEET ALERT**
    if((artist === "") || (beginDate === "") ||(endDate === "")){
        
        //replace with SWEET ALERT! cannot have "alert" in final project
        alert("Please Check Fields or Fill in Empty Fields");
    } 
   
    else{

        //beginning of AJAX call for artist info
        $.ajax({
            url: bitArtistInfoURL,
            method: "GET"
        })
            .then(function (response) {
                console.log(response);

                //Pulls artist name and image from response and appends it into target div
                var artistName = $('<h3 class = "text-center col-12">').text(response.name);
                var artistImageUrl = response.thumb_url;
                var artistImage = $('<img class = "artist-image" src="' +artistImageUrl+ '" alt = "artist picture">');
                var artistImageCol = $('<div class = "col-12">');
                var artistNamerow = $('<div class = "row artist-name-row">');
                var artistImagerow = $('<div class = "row artist-image-row">');

                console.log(artistImageUrl);

                artistNamerow.append(artistName);
                artistImageCol.append(artistImage);
                artistImagerow.append(artistImageCol);
        
                $("#target").append(artistNamerow);
                $("#target").append(artistImagerow);
            });
    
        //Ajax call for events response
        $.ajax({
        url: bitEventsURL,
        method: "GET"
    })
        .then(function (response) {
            
            console.log(response);

            //variables created to store response information
            var location = "";
            var date = "";
            var time = "";
            var tickets = "";
            var venueName = "";
            var venueDetails= "";
            var latitude = "";
            var longitude = "";
            var ticketLink = "";
            var plzWork = [];

            //if else statement so that if there is no response, the user will be alerted **USE SWEET ALERTS**
            if (response.length === 0){

                //replace with SWEET ALERT!
                alert("No Events Found");

            }
            else{

            //Ajax call for google maps    
            $.ajax({
                url: googleURL,
                method: "GET",
                dataType: 'jsonp'
                
            }).then(function () {

                //for loop to pull information from each event
                for (i = 0; i < response.length; i++) {

                    if (response[i].venue.region === ""){
                        location = response[i].venue.city + ", " + response[i].venue.country
                    }
                    else(location = response[i].venue.city + ", " + response[i].venue.region);
                    var dateInitial = response[i].datetime.slice(0,10);
                    date = moment(dateInitial).format('MMM D , YYYY');
                    var timeMilitary = response[i].datetime.slice(11,16);
                    var timeSlice = parseInt(timeMilitary.slice(0,3));
                    if (timeSlice > 12) {
                        time = timeSlice - 12 + ":00 PM";
                    }
                    else {
                        time = timeSlice + ":00 AM"
                    };
                    venueName = response[i].venue.name;
                    latitude = response[i].venue.latitude;
                    longitude = response [i].venue.longitude;
                    lineup = response[i].lineup;
                    if (response[i].offers.length === 1) {
                        tickets = "available"
                    }
                    else{
                        tickets = "unavailable"
                    };
                    var ticketLink = response[i].offers[0].url;

                    console.log("Date " + [i + 1] + ": " + date);
                    console.log("Location " + [i + 1] + ": " + location);
                    console.log("Time " + [i + 1] + ": " + time );
                    console.log("Tickets " + [i + 1] + ": " + tickets );
                    console.log("Venue Name " + [i + 1] + ": " + venueName );
                    console.log("Latitude " + [i + 1] + ": " + latitude );
                    console.log("Longitude " + [i + 1] + ": " + longitude );
                    console.log("Lineup " + [i + 1] + ": " + lineup );
                    console.log("Ticket Link " + [i + 1] + ": " + ticketLink );
                    var row= $('<div class="row">');
                    var accordion=$(`<div class="accordion mx-5 mt-5" id="accordion${i}">`);  
                    var card = $('<div class="card">');
                    var cardHeader = $(`<div class="card-header row" id= "heading${i}">`);
                    var locationText = $('<h6 class="dynamic-text text-center col-3">').text(location);
                    var dateText = $('<h6 class="dynamic-text text-center col-3"">').text(date);
                    var timeText = $('<h6 class="dynamic-text text-center col-2"">').text(time);
                    var ticketsText = $('<h6 class="dynamic-text text-center col-3"">').text("Tickets: " + tickets);
                    var cardHeaderButton = $('<button id="expand-btn" class="openBtn btn btn-link expand-button collapsed col-1" type="button" data-toggle="collapse" data-target="#collapse'+ i +'" aria-expanded="false"aria-controls="collapseOne">').html('<i class="fa fa-plus" aria-hidden="true"></i>');
                    var contentDivRow = $('<div class="row content-div">');
                    var tmCol =$('<div class="tm-col col-2">').html('<h5> Buy Tickets Now </h5> <br> <a href="' + ticketLink + '" class="btn btn-lg " role="button" target="_blank" aria-pressed="true">$$$$</a>');
                    var venueDetailCol = $('<div class="venue-details col-2">').html("<h5> Venue Info </h5> <br>" + venueName + "<br> <br>" +  "<span id='address"+i+"'>");
                    var mapHolder = $(`<div class= "mapHolder col-8" id="map${i}">`); 
                    var collapsableHolder= $(`<div id="collapse${i}" class="collapsableHolder collapse collapse-holder container-fluid" aria-labelledby="heading${i}" data-parent="#accordion${i}">`);
                    

                    
                    
                    
                    
                    // mapHolder.prepend(map);
                    contentDivRow.append(venueDetailCol);
                    contentDivRow.append(mapHolder);
                    contentDivRow.append(tmCol);
                    collapsableHolder.append(contentDivRow);
                    card.prepend(collapsableHolder);
                    cardHeader.prepend(cardHeaderButton);
                    cardHeader.prepend(ticketsText);
                    cardHeader.prepend(timeText);
                    cardHeader.prepend(dateText);
                    cardHeader.prepend(locationText);
                    
                    card.prepend(cardHeader);
                    
                    accordion.prepend(card);
                    row.prepend(accordion);
                    
                    
                    $('#target').append(row);
                    var venueData = response[i].venue
                    var x = parseFloat(venueData.latitude);
                    var y = parseFloat(venueData.longitude);
                    map = new google.maps.Map(document.getElementById(`map${i}`), {
                    // map = new google.maps.Map(mapHolder, {
                        center: { lat: x, lng: y },
                        zoom: 15
                    });
                    var marker = new google.maps.Marker({ position: { lat: x, lng: y }, map: map })

                    var streetAddress
                $.ajax({
                    url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${x},${y}&key=AIzaSyB3Kp0Vsql9BI3aWtF7DzoP1Oja0ZZjWt8`,
                    method: "GET"
                }).then(function(geo){

                    streetAddress = geo.results[0].formatted_address
                    console.log(geo);
                    console.log(streetAddress)

                    plzWork.push(streetAddress);
                    
                    if(plzWork.length<response.length){
                        for(p=0; p<plzWork.length; p++){
                            $(`#address${p}`).text(plzWork[p])
                        }
                    }
                })
                }

            })

        }

        });
    }
});


$(document).on('click','.openBtn',function(e) {
    $('.collapsableHolder').collapse('hide')
});

