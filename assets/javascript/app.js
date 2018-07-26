//variables declared to use for APIs

var apiKey = '973722cd55edcaaf54fc3f29432be2a4';
var artist = '';
var beginDate = '';
var endDate = '';
var bitEventsURL = '';
var bitArtistInfoURL = '';
var googleURL =
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3Kp0Vsql9BI3aWtF7DzoP1Oja0ZZjWt8';

//button click event to initiate search
$('.find-em-btn').on('click', function() {
  //ensures the target div is emptied for each search
  $('#target').empty();
  var plzWork = [];
  //prevents page refresh on button click
  event.preventDefault();

  //pulls input from user
  artist = $('.band-name').val();
  beginDate = $('.start-date').val();
  endDate = $('.end-date').val();

  //creation of URL for event call
  bitEventsURL =
    'https://rest.bandsintown.com/artists/' +
    artist +
    '/events?app_id=' +
    apiKey +
    '&date=' +
    beginDate +
    '%2C' +
    endDate;

  //creation of URL for artist info call
  bitArtistInfoURL =
    'https://rest.bandsintown.com/artists/' + artist + '?app_id=' + apiKey;

  //If / else statement so that if field is left empty user will be alerted and there will be no search initiated. **USE SWEET ALERT**
  if (artist === '' || beginDate === '' || endDate === '') {
    //sweet alert
    swal({
      title: 'No Search',
      text: 'Please check for spelling and/or empty fields.',
      icon: 'error',
      button: 'OK'
    });
  } else {
    //beginning of AJAX call for artist info
    $.ajax({
      url: bitArtistInfoURL,
      method: 'GET'
    }).then(function(response) {
      //Pulls artist name and image from response and appends it into target div
      var artistName = $('<h3 class = "text-center col-12">').text(
        response.name
      );
      var artistImageUrl = response.thumb_url;

      var artistImage = $(
        '<img class = "artist-image img-fluid w-100 col-sm-12 col-md-6 col-lg-5 col-xl-3" src="' +
          artistImageUrl +
          '" alt = "artist picture">'
      );

      var artistImageCol = $('<div class = "col-12">');
      var artistNamerow = $('<div class = "row artist-name-row">');
      var artistImagerow = $('<div class = "row artist-image-row">');

      artistNamerow.append(artistName);
      artistImageCol.append(artistImage);
      artistImagerow.append(artistImageCol);
      $('#target').append(artistNamerow);
      $('#target').append(artistImagerow);
    });

    //Ajax call for events response
    $.ajax({
      url: bitEventsURL,
      method: 'GET'
    }).then(function(response) {
      //variables created to store response information
      var location = '';
      var date = '';
      var time = '';
      var tickets = '';
      var venueName = '';
      var venueDetails = '';
      var latitude = '';
      var longitude = '';
      var ticketLink = '';
      var plzWork = [];

      //if else statement so that if there is no response, the user will be alerted **USE SWEET ALERTS**
      if (response.length === 0) {
        //replace with SWEET ALERT!
        swal({
          title: 'No Events Found',
          text: 'Try adjusting date range to broaden search.',
          icon: 'info',
          button: 'OK'
        });
      } else {
        //Ajax call for google maps
        $.ajax({
          url: googleURL,
          method: 'GET',
          dataType: 'jsonp'
        }).then(function() {
          //for loop to pull information from each event
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
              var ticketsText = $(
                '<h6 class="dynamic-text text-center col-3"">'
              )
                .text('Tickets: ' + tickets)
                .css('color', 'rgb(48, 193, 46)');
            } else {
              tickets = 'unavailable';
              var ticketsText = $(
                '<h6 class="dynamic-text text-center col-3"">'
              )
                .text('Tickets: ' + tickets)
                .css('color', 'rgb(234, 32, 32)');
            }
            var ticketLink = response[i].offers[0].url;

            var row = $('<div class="row">');
            var accordion = $(
              `<div class="accordion mx-5 mt-5" id="accordion${i}">`
            );
            var card = $('<div class="card">');
            var cardHeader = $(
              `<div class="card-header resultTitle row pt-3" id= "heading${i}">`
            );
            var locationText = $(
              '<h6 class="text-center col-sm-3">'
              // '<h6 class="dynamic-text text-center col-sm-3 col-md-3 col-lg-3">'
            ).text(location);
            var dateText = $(
              '<h6 class="text-center col-sm-3">'
              // '<h6 class="dynamic-text text-center col-sm-3 col-md-3 col-lg-3">'
            ).text(date);
            var timeText = $(
              '<h6 class="text-center col-sm-2">'
              // '<h6 class="dynamic-text text-center col-sm-2 col-md-2 col-lg-2">'
            ).text(time);
            var ticketsText = $(
              '<h6 class="text-center col-sm-3">'
              // '<h6 class="dynamic-text text-center col-sm-3 col-md-3 col-lg-3">'
            ).text('Tickets: ' + tickets);
            var cardHeaderButton = $(
              '<button id="expand-btn" class="openBtn btn btn-link expand-button collapsed col-sm-1" type="button" data-lat= "' +
                response[i].venue.latitude +
                '" data-long="' +
                response[i].venue.longitude +
                '" data-artist="' +
                artist +
                '"data-toggle="collapse" data-target="#collapse' +
                i +
                '" aria-expanded="false"aria-controls="collapseOne">'
            ).html('<i class="fa fa-info-circle" aria-hidden="true"></i>');
            var contentDivRow = $('<div class="row content-div">');
            var tmCol = $('<div class="tm-col col-sm-3">');
            var venueDetailCol = $('<div class="venue-details col-sm-3">').html(
              '<h5> Venue Info </h5> <br>' +
                venueName +
                '<br> <br>' +
                "<span id='address" +
                i +
                "'>"
            );
            var mapHolder = $(`<div class= "mapHolder col-sm-6" id="map${i}">`);
            var collapsableHolder = $(`<div id="collapse${i}" class="collapsableHolder collapse collapse-holder container-fluid" 
                                                    aria-labelledby="heading${i}" data-parent="#accordion${i}">`);

            // merge conflict thing1

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
            var venueData = response[i].venue;
            var x = parseFloat(venueData.latitude);
            var y = parseFloat(venueData.longitude);
            map = new google.maps.Map(document.getElementById(`map${i}`), {
              // map = new google.maps.Map(mapHolder, {
              center: { lat: x, lng: y },
              zoom: 15,
              styles: [
                {
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#212121'
                    }
                  ]
                },
                {
                  elementType: 'labels.icon',
                  stylers: [
                    {
                      visibility: 'off'
                    }
                  ]
                },
                {
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#757575'
                    }
                  ]
                },
                {
                  elementType: 'labels.text.stroke',
                  stylers: [
                    {
                      color: '#212121'
                    }
                  ]
                },
                {
                  featureType: 'administrative',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#757575'
                    }
                  ]
                },
                {
                  featureType: 'administrative.country',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#9e9e9e'
                    }
                  ]
                },
                {
                  featureType: 'administrative.land_parcel',
                  stylers: [
                    {
                      visibility: 'off'
                    }
                  ]
                },
                {
                  featureType: 'administrative.locality',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#bdbdbd'
                    }
                  ]
                },
                {
                  featureType: 'poi',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#757575'
                    }
                  ]
                },
                {
                  featureType: 'poi.park',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#181818'
                    }
                  ]
                },
                {
                  featureType: 'poi.park',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#616161'
                    }
                  ]
                },
                {
                  featureType: 'poi.park',
                  elementType: 'labels.text.stroke',
                  stylers: [
                    {
                      color: '#1b1b1b'
                    }
                  ]
                },
                {
                  featureType: 'road',
                  elementType: 'geometry.fill',
                  stylers: [
                    {
                      color: '#2c2c2c'
                    }
                  ]
                },
                {
                  featureType: 'road',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#8a8a8a'
                    }
                  ]
                },
                {
                  featureType: 'road.arterial',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#373737'
                    }
                  ]
                },
                {
                  featureType: 'road.highway',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#3c3c3c'
                    }
                  ]
                },
                {
                  featureType: 'road.highway.controlled_access',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#4e4e4e'
                    }
                  ]
                },
                {
                  featureType: 'road.local',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#616161'
                    }
                  ]
                },
                {
                  featureType: 'transit',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#757575'
                    }
                  ]
                },
                {
                  featureType: 'water',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#50d1fc'
                    }
                  ]
                },
                {
                  featureType: 'water',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#3d3d3d'
                    }
                  ]
                }
              ]
            });
            var marker = new google.maps.Marker({
              position: { lat: x, lng: y },
              map: map
            });

            var streetAddress;
            $.ajax({
              url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${x},${y}&key=AIzaSyB3Kp0Vsql9BI3aWtF7DzoP1Oja0ZZjWt8`,
              method: 'GET'
            }).then(function(geo) {
              streetAddress = geo.results[0].formatted_address;
              console.log(geo);
              console.log(streetAddress);

              plzWork.push(streetAddress);

              if (plzWork.length < response.length) {
                for (p = 0; p < plzWork.length; p++) {
                  $(`#address${p}`).text(plzWork[p]);
                }
              }
            });
          }
        });
      }
    });
  }
});

$(document).on('click', '.openBtn', function(e) {
  $('.collapsableHolder').collapse('hide');
});

//TICKETMASTER FUNCTION
function ticketMaster(latitude, longitude, artist) {
  $('.tm-col').empty();
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
    a.text('$$$$');
    $('.tm-col').html('<h5> Buy Tickets Now </h5> <br>');
    $('.tm-col').append(a);
  });
}

//ON CLICK EVENT THAT TRIGGERS TICKETMASTER FUNCTION
$('#target').on('click', '.openBtn', function(event) {
  var latitude = $(this).attr('data-lat');
  var longitude = $(this).attr('data-long');
  var artist = $(this).attr('data-artist');
  ticketMaster(latitude, longitude, artist);
});
