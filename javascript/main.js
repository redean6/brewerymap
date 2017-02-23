
var map;

var markers = [];


var allBreweries = {
  breweries: ko.observableArray([
      {name:"Verboten Brewing & Barrel Project", location:{lat:40.396818, lng:-105.075115}, city:'Loveland'},
      {name:"Grimm Brothers Brewing", location:{lat:40.396763 , lng:-105.046949}, city: 'Loveland'},
      {name:"Loveland Ale Works", location:{lat:40.395281 , lng:-105.077335}, city: 'Loveland'},
      {name:"City Star Brewing", location:{lat:40.305052 , lng:-105.078952}, city: 'Berthoud'},
      {name:"Left Hand Brewing", location:{lat:40.158286 , lng:-105.115023}, city: 'Longmont'},
      {name:"High Hops Brewing", location:{lat:40.480687 , lng:-104.935613}, city: 'Windsor'},
      {name:"New Belgium Brewing", location:{lat:40.592796 , lng:-105.068601}, city: 'Fort Collins'},
      {name:"Odell Brewing", location:{lat:40.589467 , lng:-105.063182}, city: 'Fort Collins'},
      {name:"Horse & Dragon Brewing", location:{lat:40.589644 , lng:-105.045623}, city: 'Fort Collins'},
      {name:"Zwei Brothers Brewing", location:{lat:40.522753 , lng:-105.078360}, city: 'Fort Collins'},
      {name:"Avery Brewing", location:{lat:40.062563 , lng:-105.204743}, city: 'Boulder'}
      //{name:"Mean Dean Brewing", location:{lat:40.3951599 , lng:-105.0533840}, city: 'Loveland'}
    ])
};

allBreweries.query = ko.observable('');

allBreweries.filteredBreweries = ko.observableArray([]);

allBreweries.search = ko.computed(function(){
  //console.log(allBreweries.query());
  var query = allBreweries.query().toLowerCase();
  allBreweries.filteredBreweries([]);
  //console.log(query);
  allBreweries.breweries().forEach(function(brewery){
    //console.log(brewery);
    //console.log(brewery.name.indexOf(query));
    var city = brewery.city.toLowerCase();
    var match = city.indexOf(query);
    //console.log(name, query, match);
    if (match> -1) {
      allBreweries.filteredBreweries.push(brewery);
    }

  });
});



function initMap() {
        
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.3951599802915 , lng:-105.053384019708 },
          zoom: 15
        });

  	var bounds = new google.maps.LatLngBounds();



  showMarkers();



  document.getElementById('zoom').addEventListener('click',showMarkers);

  ko.applyBindings(allBreweries);
}

// make the markers part of breweries



function showMarkers(){

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

    var infoWindow = new google.maps.InfoWindow()



  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < allBreweries.filteredBreweries().length; i++){
    var position = allBreweries.filteredBreweries()[i].location;
    var breweryCity = allBreweries.filteredBreweries()[i].city;
    var breweryName = allBreweries.filteredBreweries()[i].name;
    var brewerylat = allBreweries.filteredBreweries()[i].location.lat;
    var brewerylng = allBreweries.filteredBreweries()[i].location.lng;
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      id: i,
      icon:'images/bar.png',
      title: breweryName,
      city: breweryCity,
      lat: brewerylat,
      lng: brewerylng

    });

   // 1. apiData will get me the venue ID with response.venues.id
   // 2. fourSquareHours needs the venue ID where indicated
  function apiData(marker){
  		console.log(marker.lat,marker.lng);
  	    var fourSquareAPI = 'https://api.foursquare.com/v2/venues/search?ll='+marker.lat+','+marker.lng+'&oauth_token=NCZR4E52CTOVIW2C0HMOZLPZL3ZLOUQSUVNB55MUYBQNEVJP&v=201'
  	    console.log(fourSquareAPI);
  	    //var fourSquareHours= 'https://api.foursquare.com/v2/venues/'+ fourSquareAPI.response.venues.id +'/hours?oauth_token=NCZR4E52CTOVIW2C0HMOZLPZL3ZLOUQSUVNB55MUYBQNEVJP&v=20170223'
    $getJSON(fourSquareAPI, function(data){
    	console.log(data.response.venues.id);
    })
  }


      function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div >' + marker.title + '</div>' + '<div>'+ marker.lat + '</div>'+ '<div>'+ marker.lng + '</div>'+ '<div id="hours"></div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        }
      }

    markers.push(marker);

    marker.addListener('click', function() {
            populateInfoWindow(this, infoWindow);
            apiData(this);
          });

    bounds.extend(marker.position);

    
  };

   map.fitBounds(bounds);

  };
