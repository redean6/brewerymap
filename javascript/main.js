
var map;

var markers = [];


var allBreweries = {
  breweries: ko.observableArray([{
      name: "Verboten Brewing & Barrel Project",
      id: 'verboten',
      location: {
        lat: 40.396818,
        lng: -105.075115
      },
      city: 'Loveland'
    },
    {
      name: "Grimm Brothers Brewhouse",
      id: 'grimm',
      location: {
        lat: 40.396763,
        lng: -105.046949
      },
      city: 'Loveland'
    },
    {
      name: "Loveland Ale Works",
      id: 'works',
      location: {
        lat: 40.395281,
        lng: -105.077335
      },
      city: 'Loveland'
    },
    {
      name: "City Star Brewing",
      id: 'star',
      location: {
        lat: 40.305052,
        lng: -105.078952
      },
      city: 'Berthoud'
    },
    {
      name: "Left Hand Brewing",
      id: 'left',
      location: {
        lat: 40.158286,
        lng: -105.115023
      },
      city: 'Longmont'
    },
    {
      name: "High Hops Brewing",
      id: "hops",
      location: {
        lat: 40.480687,
        lng: -104.935613
      },
      city: 'Windsor'
    },
    {
      name: "New Belgium Brewing",
      id: 'belgium',
      location: {
        lat: 40.592796,
        lng: -105.068601
      },
      city: 'Fort Collins'
    },
    {
      name: "Odell Brewing",
      id: 'odell',
      location: {
        lat: 40.589467,
        lng: -105.063182
      },
      city: 'Fort Collins'
    },
    {
      name: "Horse & Dragon Brewing",
      id:'horse',
      location: {
        lat: 40.589644,
        lng: -105.045623
      },
      city: 'Fort Collins'
    },
    {
      name: "Zwei Brothers Brewing",
      id: 'zwei',
      location: {
        lat: 40.522753,
        lng: -105.078360
      },
      city: 'Fort Collins'
    },
    {
      name: "Avery Brewing",
      id: 'Avery',
      location: {
        lat: 40.062563,
        lng: -105.204743
      },
      city: 'Boulder'
    }
    //{name:"Mean Dean Brewing", location:{lat:40.3951599 , lng:-105.0533840}, city: 'Loveland'}
  ])
};

allBreweries.query = ko.observable('');

allBreweries.filteredBreweries = ko.observableArray([]);

allBreweries.infoWindowContent = ko.observable('');

allBreweries.activeMarker = null;
allBreweries.infoWindow = null;

allBreweries.infoWindowContentChanged = ko.computed(function() {
  console.log(allBreweries.infoWindowContent());
  if (allBreweries.activeMarker) {
    populateInfoWindow(allBreweries.activeMarker, allBreweries.infoWindow, allBreweries.infoWindowContent());
  }
});

allBreweries.search = ko.computed(function() {
  //console.log(allBreweries.query());
  var query = allBreweries.query().toLowerCase();
  allBreweries.filteredBreweries([]);
  //console.log(query);
  allBreweries.breweries().forEach(function(brewery) {
    //console.log(brewery);
    //console.log(brewery.name.indexOf(query));
    var city = brewery.city.toLowerCase();
    var match = city.indexOf(query);
    //console.log(name, query, match);
    if (match > -1) {
      allBreweries.filteredBreweries.push(brewery);
    }

  });
});



function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 40.3951599802915,
      lng: -105.053384019708
    },
    zoom: 15
  });

  var bounds = new google.maps.LatLngBounds();



  showMarkers();



  document.getElementById('zoom').addEventListener('click', showMarkers);

  ko.applyBindings(allBreweries);
}

// make the markers part of breweries



function showMarkers() {

  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
  }

  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }

  deleteMarkers();

  var infoWindow = new google.maps.InfoWindow();

  allBreweries.infoWindow = infoWindow;

  var hereNow



  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < allBreweries.filteredBreweries().length; i++) {
    var position = allBreweries.filteredBreweries()[i].location;
    var breweryCity = allBreweries.filteredBreweries()[i].city;
    var breweryName = allBreweries.filteredBreweries()[i].name;
    var brewerylat = allBreweries.filteredBreweries()[i].location.lat;
    var brewerylng = allBreweries.filteredBreweries()[i].location.lng;
    var breweryid = allBreweries.filteredBreweries()[i].id;
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      id: i,
      animation: google.maps.Animation.DROP,
      icon: 'images/bar.png',
      title: breweryName,
      city: breweryCity,
      lat: brewerylat,
      lng: brewerylng


    });

    function apiData(marker) {
      // console.log(marker.lat, marker.lng);
      //var fourSquareAPI = 'https://api.foursquare.com/v2/venues/search?ll=' + marker.lat + ',' + marker.lng + '&oatuh_token=NCZR4E52CTOVIW2C0HMOZLPZL3ZLOUQSUVNB55MUYBQNEVJP&v=201';
      //var fourSquareHours= 'https://api.foursquare.com/v2/venues/'+ fourSquareAPI.response.venues.id +'/hours?oauth_token=NCZR4E52CTOVIW2C0HMOZLPZL3ZLOUQSUVNB55MUYBQNEVJP&v=20170223'
      // $.getJSON(fourSquareAPI, function(data){
      //     console.log(data.response.venues.id);
      // })

      var CLIENT_ID = 'NCZR4E52CTOVIW2C0HMOZLPZL3ZLOUQSUVNB55MUYBQNEVJP',
        CLIENT_SECRET = 'GODNFJRZ4M1BZCS3SVV1VIUTMWE3XFYRATBEV2NX1XNEW1UF',
        version = '20130815',
        city = 'San Francisco',
        query = marker.title,
        base_url = "https://api.foursquare.com/v2/venues",
        lat_lng = marker.lat + ',' + marker.lng;

      //console.log(lat_lng);

      $.ajax({
        url: base_url + '/search',
        dataType: 'json',
        data: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          ll: lat_lng,
          v: version,
          query: query,
          async: true
        }
      }).done(function(result) {
        console.log(result);
        //console.log(result.response.venues[0].id);
        var id = result.response.venues[0].id;
        var hereNow = result.response.venues[0].hereNow.count;
        //console.log(hereNow);
        var name = result.response.venues[0].name;
        allBreweries.infoWindowContent('<h4>' + name + '</h4>' + '<h5>Four Square Members here: ' + hereNow + '</h5>' );
        //var test = Math.random();

        //allBreweries.infoWindowContent('<p>People here right now: ' + test + '</p>');
      
        //getDetails(id);
      }).fail(function(error) {
        console.log(error);
      });
    }

    // function getDetails(id) {
    //   //console.log(id);
    //   var CLIENT_ID = 'NCZR4E52CTOVIW2C0HMOZLPZL3ZLOUQSUVNB55MUYBQNEVJP',
    //     CLIENT_SECRET = 'GODNFJRZ4M1BZCS3SVV1VIUTMWE3XFYRATBEV2NX1XNEW1UF',
    //     version = '20130815',
    //     hours_url = "https://api.foursquare.com/v2/venues/" + id + "/hours",
    //     lat_lng = marker.lat + ',' + marker.lng;

    //   $.ajax({
    //     url: hours_url,
    //     dataType: 'json',
    //     data: {
    //       client_id: CLIENT_ID,
    //       client_secret: CLIENT_SECRET,
    //       v: version
    //     }

    //   }).done(function(hourResult) {
        //console.log("hourResult");

        var currentContent = allBreweries.infoWindowContent();
        //var openingHours = "tbd";

        //allBreweries.infoWindowContent(currentContent + '<h6>Opening Hours</h6><p>' +  + '</p>');

        // console.log(hourResult);

        //console.log(result.response.hours.timeframes);

        //var timeframes = result.response.hours.timeframes;

        //console.log(timeframes);

      //Create a function here that iterates over the timeframe array. 


    markers.push(marker);

    marker.addListener('click', function() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setAnimation(null);
        };

        allBreweries.activeMarker = this;
        apiData(this);
        if (this.getAnimation() !== null) {
            this.setAnimation(null);
        } else {
            this.setAnimation(google.maps.Animation.BOUNCE);
        }
    });



    bounds.extend(marker.position);


  }; //closes for loop

  map.fitBounds(bounds);

}; //closes show markers

function populateInfoWindow(marker, infoWindow, currentContent) {

  // Check to make sure the infowindow is not already opened on this marker.
  if (infoWindow.marker != marker) {
    infoWindow.marker = marker;
    infoWindow.setContent('<div id="here"> ' + currentContent + '</div>');
    //infoWindow.setContent(currentContent);
    infoWindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infoWindow.addListener('closeclick', function() {
      infoWindow.marker = null;
    });
  }
}