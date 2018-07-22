//API info for BandsInTown
var apiKey = "973722cd55edcaaf54fc3f29432be2a4";
var artist = "";
var beginDate = "2018-09-09";
var endDate = "2018-10-10";
var queryURL = "";

//Beginning of on-click function for search
$(".find-em-btn").on("click" , function(){
   //prevents refresh on submit
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

    //creation of URL for call
    queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + apiKey + "&date=" + beginDate + "%2C" + endDate;

    if((artist === "") || (beginDate === "") ||(endDate === "")){
        alert("Please Check Fields or Fill in Empty Fields");
    } 
   
    else{
        //begginin of AJAX call
        $.ajax({
        url: queryURL,
        method: "GET"
        })
    
    .then(function(response) {
        
        //console log for test, delete before final push!!
        console.log(response);
    
        console.log(queryURL);

        if (response.length === 0){
            var noResult = $("<h3>");
            noResult.text("No Events");
            $("#band-store").html(noResult);
        }
        
        else{
            //creation of variables to be used in for loop
            var location = "";
            var date = "";
            var time = "";
            var tickets = "";
            var vanueName = "";
            var latitude = "";
            var longitude = "";
            var lineup =[];

            //dynamically creats table and table header
            var newTable = $("<table>");
            newTable.addClass("table")
            var newTableHead = $("<thead>");
            var newTableRow = $("<tr>");
            var newTableHeadTextLocation = $("<th>").attr("scope" , "col");
            var newTableHeadTextDate = $("<th>").attr("scope" , "col");
            var newTableHeadTextTime = $("<th>").attr("scope" , "col");
            var newTableHeadTextTickets = $("<th>").attr("scope" , "col");
            var newTableBody = $("<tbody>")  

            $("#band-store").html(newTable);
            newTable.append(newTableHead);
            newTableHead.append(newTableRow);
            newTableRow.append(newTableHeadTextLocation);
            newTableRow.append(newTableHeadTextDate);
            newTableRow.append(newTableHeadTextTime);
            newTableRow.append(newTableHeadTextTickets);
            newTable.append(newTableBody);

                //for loop to loop through response array and pull info
                for(i = 0 ; i < response.length ; i ++){
                
                    //if/else so that if the location is out of the country it doesnt leave a blank
                    if(response[i].venue.region === "") {
                        location = response[i].venue.city + ", " + response[i].venue.country
                    }
                    else(location = response[i].venue.city + ", " + response[i].venue.region)
                    
                    //sliced to pull specific parts of return from datetime (need to format later)
                    dateInitial = response[i].datetime.slice(0,10);
                

                    date = moment(dateInitial).format('MMM D , YYYY');
                    
                    //taking the time response from datetime and changing it from military to standard AM/PM
                    timeMilitary = response[i].datetime.slice(11,16);
                    timeSlice = parseInt(timeMilitary.slice(0,3));
                    if (timeSlice > 12) {
                        time = timeSlice - 12 + ":00 PM";
                    }
                    else {
                        time = timeSlice + ":00 AM"
                    }
                    venueName = response[i].venue.name;
                    latitude = response[i].venue.latitude;
                    longitude = response [i].venue.longitude;
                    lineup = response[i].lineup;
                
                    //checks to see if tickets are available (if they are not the offers array is empty)
                    if (response[i].offers.length === 1) {
                        tickets = "available"
                    }
                    else{
                        tickets = "unavailable"
                    };
                
                //console log for test, delete before final push!!
                    console.log("Location " + [i + 1] + ": " + location );
                    console.log("Date " + [i + 1] + ": " + date );
                    console.log("Time " + [i + 1] + ": " + time );
                    console.log("Tickets " + [i + 1] + ": " + tickets );
                    console.log("Venue Name " + [i + 1] + ": " + venueName );
                    console.log("Latitude " + [i + 1] + ": " + latitude );
                    console.log("Longitude " + [i + 1] + ": " + longitude );
                    console.log("Lineup " + [i + 1] + ": " + lineup );

                    //dynamically creates rows for each event
                    var newEvent = $("<tr>");
                    var newLocation = $("<td>");
                    var newDate = $("<td>");
                    var newTime = $("<td>");
                    var newTickets = $("<td>");

                    //adds the text to each table element
                    newTableHeadTextLocation.text("Location");
                    newTableHeadTextDate.text("Date");
                    newTableHeadTextTime.text("Time");
                    newTableHeadTextTickets.text("Ticket Availability");
                    newLocation.text(location);
                    newDate.text(date);
                    newTime.text(time);
                    newTickets.text(tickets);

                    //appends table info to create each row
                    newTableBody.append(newEvent);
                    newEvent.append(newLocation);
                    newEvent.append(newDate);
                    newEvent.append(newTime);
                    newEvent.append(newTickets);

                };
            }   
        });
    }
});




