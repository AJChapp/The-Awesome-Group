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
            for (i = 0; i < 5; i++) {
                
                var row= $('<div class="row">');
                var accordion=$(`<div class="accordion mx-5 mt-5" id="accordion${i}">`);  
                var card = $('<div class="card">');
                var cardHeader = $(`<div class="card-header" id= "heading${i}">`);
                var date = $('<h6 class="dynamic-text">').text('Date');
                var time = $('<h6 class="dynamic-text">').text('Time');
                var tickets = $('<h6 class="dynamic-text">').text('Tickets');
                var cardHeaderButton = $('<button class="btn btn-link expand-button collapsed" type="button" data-toggle="collapse" data-target="#collapse'+ i +'" aria-expanded="false"aria-controls="collapseOne">').html('<i class="fa fa-plus" aria-hidden="true"></i>');
                

                var mapHolder = $(`<div class= "mapHolder" id="map${i}">`); 
                var ticketMaster = $('<div class="ticketMaster">').text('hi');
                var address = $('<div class="address">');
                var lineup = $('<div class="lineup">');
                var collapsableHolder= $(`<div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordion${i}">`);
                

                
                
                
                
                // mapHolder.prepend(map);
                collapsableHolder.prepend(mapHolder);
                collapsableHolder.prepend(ticketMaster);
                collapsableHolder.prepend(address);
                collapsableHolder.prepend(lineup);
                card.prepend(collapsableHolder);
                cardHeader.prepend(tickets);
                cardHeader.prepend(time);
                cardHeader.prepend(date);
                cardHeader.prepend(cardHeaderButton);
                card.prepend(cardHeader);
                
                accordion.prepend(card);
                row.prepend(accordion);
                
                
                $('#target').prepend(row);
                var venueData = response[i].venue
                var x = parseFloat(venueData.latitude);
                var y = parseFloat(venueData.longitude);
                map = new google.maps.Map(document.getElementById(`map${i}`), {
                // map = new google.maps.Map(mapHolder, {
                    center: { lat: x, lng: y },
                    zoom: 15
                });
                console.log(map);
            }

        })



    });



