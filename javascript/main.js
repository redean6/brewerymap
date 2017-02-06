
var map;

var markers = [];
  
var allBreweries = {
  breweries: ko.observableArray([
      {name:"Verboten Brewing & Barrel Project", location:{lat:40.396818, lng:-105.075115 }},
      {name:"Grimm Brothers Brewing", location:{lat:40.396763 , lng:-105.046949}},
      {name:"Loveland Ale Works", location:{lat:40.395281 , lng:-105.077335}},
      {name:"City Star Brewing", location:{lat:40.305052 , lng:-105.078952}},
      {name:"Left Hand Brewing", location:{lat:40.158286 , lng:-105.115023}},
      {name:"High Hops Brewing", location:{lat:40.480687 , lng:-104.935613}},
      {name:"New Belgium Brewing", location:{lat:40.592796 , lng:-105.068601}},
      {name:"Odell Brewing", location:{lat:40.589467 , lng:-105.063182}},
      {name:"Horse & Dragon Brewing", location:{lat:40.589644 , lng:-105.045623}},
      {name:"Zwei Brothers Brewing", location:{lat:40.522753 , lng:-105.078360}},
      {name:"Avery Brewing", location:{lat:40.062563 , lng:-105.204743}},
      {name:"Mean Dean Brewing", location:{lat:40.3951599 , lng:-105.0533840}}
    ])
};
ko.applyBindings(allBreweries);

/*var breweries = ko.observableArray([
      {name:"Verboten Brewing & Barrel Project", location:{lat:40.396818, lng:-105.075115 }},
      {name:"Grimm Brothers Brewing", location:{lat:40.396763 , lng:-105.046949}},
      {name:"Loveland Ale Works", location:{lat:40.395281 , lng:-105.077335}},
      {name:"City Star Brewing", location:{lat:40.305052 , lng:-105.078952}},
      {name:"Left Hand Brewing", location:{lat:40.158286 , lng:-105.115023}},
      {name:"High Hops Brewing", location:{lat:40.480687 , lng:-104.935613}},
      {name:"New Belgium Brewing", location:{lat:40.592796 , lng:-105.068601}},
      {name:"Odell Brewing", location:{lat:40.589467 , lng:-105.063182}},
      {name:"Horse & Dragon Brewing", location:{lat:40.589644 , lng:-105.045623}},
      {name:"Zwei Brothers Brewing", location:{lat:40.522753 , lng:-105.078360}},
      {name:"Avery Brewing", location:{lat:40.062563 , lng:-105.204743}},
      {name:"Mean Dean Brewing", location:{lat:40.3951599 , lng:-105.0533840}}
    ]);*/

 function initMap() {
        
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.3951599802915 , lng:-105.053384019708 },
          zoom: 15
        });

  var bounds = new google.maps.LatLngBounds();



  for (var i = 0; i < allBreweries.breweries().length; i++) {
  	var position = allBreweries.breweries()[i].location;
  	var marker = new google.maps.Marker({
      map: map,
  		position: position,
  		id: i
  	});
  	markers.push(marker);

    bounds.extend(marker.position);
  };

  document.getElementById('on').addEventListener('click',showBreweries);
  document.getElementById('off').addEventListener('click',hideBreweries);

  map.fitBounds(bounds);
}

function hideBreweries() {
  for (var i=0; i < markers.length; i++){
    markers[i].setMap(null);
  }
}

function showBreweries(){
  var bounds =new google.maps.LatLngBounds();

  for (var i=0; i< markers.length; i++){
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

