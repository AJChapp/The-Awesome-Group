
var apiKey = "973722cd55edcaaf54fc3f29432be2a4";
var artist = "";
var beginDate = "2018-09-09";
var endDate = "2018-10-10";
var queryURL = "";



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
    });
});
