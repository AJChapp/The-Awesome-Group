var apiKey = '973722cd55edcaaf54fc3f29432be2a4';
var artist = '';
var beginDate = '';
var endDate = '';
var queryURL = '';
var googleURL =
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3Kp0Vsql9BI3aWtF7DzoP1Oja0ZZjWt8';

$('.find-em-btn').on('click', function() {
  $('#target').empty();

  event.preventDefault();

  //pulls input from user
  artist = $('.band-name').val();
  beginDate = $('.start-date').val();
  endDate = $('.end-date').val();

  //console log for test, delete before final push!!
  console.log(artist);
  console.log(beginDate);
  console.log(endDate);
  console.log(typeof endDate);

  //creation of URL for call
  queryURL =
    'https://rest.bandsintown.com/artists/' +
    artist +
    '/events?app_id=' +
    apiKey +
    '&date=' +
    beginDate +
    '%2C' +
    endDate;

  if (artist === '' || beginDate === '' || endDate === '') {
    alert('Please Check Fields or Fill in Empty Fields');
  } else {
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
      console.log(response);

      console.log(queryURL);

      var location = '';
      var date = '';
      var time = '';
      var tickets = '';
      var venueName = '';
      var latitude = '';
      var longitude = '';
      var lineup = [];

      if (response.length === 0) {
        alert('No Events Found');
      } else {
        $.ajax({
          url: googleURL,
          method: 'GET',
          dataType: 'jsonp'
        }).then(function() {
          for (i = 0; i < response.length; i++) {
            if (response[i].venue.region === '') {
              location =
                response[i].venue.city + ', ' + response[i].venue.country;
            } else
              location =
                response[i].venue.city + ', ' + response[i].venue.region;
            var dateInitial = response[i].datetime.slice(0, 10);
            date = moment(dateInitial).format('MMM D , YYYY');
            var timeMilitary = response[i].datetime.slice(11, 16);
            var timeSlice = parseInt(timeMilitary.slice(0, 3));
            if (timeSlice > 12) {
              time = timeSlice - 12 + ':00 PM';
            } else {
              time = timeSlice + ':00 AM';
            }
            venueName = response[i].venue.name;
            latitude = response[i].venue.latitude;
            longitude = response[i].venue.longitude;
            lineup = response[i].lineup;
            if (response[i].offers.length === 1) {
              tickets = 'available';
            } else {
              tickets = 'unavailable';
            }

            console.log('Date ' + [i + 1] + ': ' + date);
            console.log('Location ' + [i + 1] + ': ' + location);
            console.log('Time ' + [i + 1] + ': ' + time);
            console.log('Tickets ' + [i + 1] + ': ' + tickets);
            console.log('Venue Name ' + [i + 1] + ': ' + venueName);
            console.log('Latitude ' + [i + 1] + ': ' + latitude);
            console.log('Longitude ' + [i + 1] + ': ' + longitude);
            console.log('Lineup ' + [i + 1] + ': ' + lineup);
            var row = $('<div class="row">');
            var accordion = $(
              `<div class="accordion mx-5 mt-5" id="accordion${i}">`
            );
            var card = $('<div class="card">');
            var cardHeader = $(
              `<div class="card-header row" id= "heading${i}">`
            );
            var locationText = $(
              '<h6 class="dynamic-text text-center col-3">'
            ).text(location);
            var dateText = $(
              '<h6 class="dynamic-text text-center col-3"">'
            ).text(date);
            var timeText = $(
              '<h6 class="dynamic-text text-center col-2"">'
            ).text(time);
            var ticketsText = $(
              '<h6 class="dynamic-text text-center col-3"">'
            ).text('Tickets: ' + tickets);
            var cardHeaderButton = $(
              '<button class="btn btn-link expand-button collapsed col-1" type="button" data-lat= "' +
                response[i].venue.latitude +
                '" data-long="' +
                response[i].venue.longitude +
                '" data-artist="' +
                artist +
                '" data-toggle="collapse" data-target="#collapse' +
                i +
                '" aria-expanded="false"aria-controls="collapseOne">'
            ).html('<i class="fa fa-plus" aria-hidden="true"></i>');

            var mapHolder = $(`<div class= "mapHolder row " id="map${i}">`);
            var ticketMaster = $('<div class="ticketMaster">').text('hi');
            var address = $('<div class="address">');
            var lineup = $('<div class="lineup">');
            var collapsableHolder = $(
              `<div id="collapse${i}" class="collapse collapse-holder" aria-labelledby="heading${i}" data-parent="#accordion${i}">`
            );

            // mapHolder.prepend(map);
            collapsableHolder.prepend(mapHolder);
            collapsableHolder.prepend(ticketMaster);
            collapsableHolder.prepend(address);
            collapsableHolder.prepend(lineup);
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
            var venueData = response[i].venue;
            var x = parseFloat(venueData.latitude);
            var y = parseFloat(venueData.longitude);
            map = new google.maps.Map(document.getElementById(`map${i}`), {
              // map = new google.maps.Map(mapHolder, {
              center: { lat: x, lng: y },
              zoom: 15
            });
          }
        });
      }
    });
  }
});

//TICKETMASTER FUNCTION
function ticketMaster(latitude, longitude, artist) {
  $('.ticketMaster').empty();
  console.log('Ticket Master is Running');
  var latlong = latitude + ',' + longitude;
  var ticketmasterURL =
    'https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=GQBnWIiXMKGG8uEpwpzNpy0i12dwWifb&latlong=' +
    latlong +
    '&keyword=' +
    artist;
  $.ajax({
    url: ticketmasterURL,
    method: 'GET'
  }).then(function(response) {
    var a = $('<a>');
    a.attr('href', response._embedded.events[0].url);
    a.attr('target', '_blank');
    a.addClass('btn btn-primary');
    a.text('Ticketmaster');
    $('.ticketMaster').append(a);
  });
}

//ON CLICK EVENT THAT TRIGGERS TICKETMASTER FUNCTION
$('#target').on('click', '.btn', function(event) {
  var latitude = $(this).attr('data-lat');
  var longitude = $(this).attr('data-long');
  var artist = $(this).attr('data-artist');
  ticketMaster(latitude, longitude, artist);
});
