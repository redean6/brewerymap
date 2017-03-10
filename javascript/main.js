var map;

var markers = [];

//allBreweries is the viewModel
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
            id: 'horse',
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
        //One Day....Mean Dean Brewing coming soon...
        // {
        //  name:"Mean Dean Brewing", 
        //  location:{
        //    lat:40.3951599, 
        //    lng:-105.0533840
        //  }, 
        //  city: 'Loveland'
        // }
    ])
};

allBreweries.activateMarker = function(brewery) {
    google.maps.event.trigger(brewery.marker, 'click');
};
//Connects the zoom button to currentBounds Functions
allBreweries.zoomButton = function(){
	currentBounds();
};

allBreweries.query = ko.observable('');

allBreweries.filteredBreweries = ko.observableArray([]);

allBreweries.infoWindowContent = ko.observable('');

allBreweries.activeMarker = null;
allBreweries.infoWindow = null;

//Sets API content in the infoWindows
allBreweries.infoWindowContentChanged = ko.computed(function() {
    allBreweries.infoWindowContent();
    if (allBreweries.activeMarker) {
        populateInfoWindow(allBreweries.activeMarker, allBreweries.infoWindow, allBreweries.infoWindowContent());
    }
});
//Uses the search to create the filteredBreweries array
allBreweries.search = ko.computed(function() {
    var query = allBreweries.query().toLowerCase();
    allBreweries.filteredBreweries([]);
    allBreweries.breweries().forEach(function(brewery) {
        var city = brewery.city.toLowerCase();
        var match = city.indexOf(query);
        if (match > -1) {
            allBreweries.filteredBreweries.push(brewery);
        }

    });
    newVisible();
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

    ko.applyBindings(allBreweries);
}
//Reads informatiion from original array create the set of markers that will apper on the map. 
function showMarkers() {



    // function deleteMarkers() {
    //     clearMarkers();
    //     markers = [];
    // }
    // //We want to make sure there are no markers already up. 
    //deleteMarkers();

    var infoWindow = new google.maps.InfoWindow();

    allBreweries.infoWindow = infoWindow;

    var bounds = new google.maps.LatLngBounds();
    //Creates a marker object for each brewery
    for (var i = 0; i < allBreweries.breweries().length; i++) {
        var position = allBreweries.breweries()[i].location;
        var breweryCity = allBreweries.breweries()[i].city;
        var breweryName = allBreweries.breweries()[i].name;
        var brewerylat = allBreweries.breweries()[i].location.lat;
        var brewerylng = allBreweries.breweries()[i].location.lng;
        var breweryid = allBreweries.breweries()[i].id;
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

        allBreweries.breweries()[i].marker = marker;
        //Sets bounds so it is zoomed over all the breweries in the beginning. 
        bounds.extend(allBreweries.breweries()[i].location);
        map.fitBounds(bounds);

        apiData(marker);
        var currentContent = allBreweries.infoWindowContent();

        markers.push(marker);
        //Sets the animation of the markers when clicked. 
        marker.addListener('click', animateMarker);


    }
}
     function noVisible() {
         for (var i = 0; i < markers.length; i++) {
             markers[i].setVisible(false);
         }
     }

     function newVisible() {
         noVisible();
         console.log(allBreweries.filteredBreweries())
         for (var i=0; i < allBreweries.filteredBreweries().length; i++){
         	allBreweries.filteredBreweries()[i].marker.setVisible(true);
         }
     }

function animateMarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
    }

    allBreweries.activeMarker = this;
    apiData(this);
    if (this.getAnimation() !== null) {
        this.setAnimation(null);
    } else {
        this.setAnimation(google.maps.Animation.BOUNCE);
    }
};

function apiData(marker) {
    //searches for the breweries on fourSquare
    var CLIENT_ID = 'NCZR4E52CTOVIW2C0HMOZLPZL3ZLOUQSUVNB55MUYBQNEVJP',
        CLIENT_SECRET = 'GODNFJRZ4M1BZCS3SVV1VIUTMWE3XFYRATBEV2NX1XNEW1UF',
        version = '20130815',
        city = 'San Francisco',
        query = marker.title,
        base_url = "https://api.foursquare.com/v2/venues",
        lat_lng = marker.lat + ',' + marker.lng;

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
        var id = result.response.venues[0].id;
        var hereNow = result.response.venues[0].hereNow.count;
        var name = result.response.venues[0].name;
        allBreweries.infoWindowContent('<h4>' + name + '</h4>' + '<h5>Four Square Members here: ' + hereNow + '</h5>');

    }).fail(function(error) {
        console.log(error);
        allBreweries.infoWindowContent('<h4>' + breweryName + '</h4>' + '<h5>Four Square Members here: ' + 'We are having a little trouble, try again later.' + '</h5>');
    });
}

//function that is connected to the zoom button chaning the bounds to zoom over a city
function currentBounds() {
    var currentBounds = new google.maps.LatLngBounds();
    console.log(allBreweries.filteredBreweries());
    for (var i = 0; i < allBreweries.filteredBreweries().length; i++) {
        currentBounds.extend(allBreweries.filteredBreweries()[i].location);
    }
    map.fitBounds(currentBounds);

}
//function that is connected to the zoom button chaning the bounds to zoom over a city
function populateInfoWindow(marker, infoWindow, currentContent) {

    if (infoWindow.marker != marker) {
        infoWindow.marker = marker;
        infoWindow.setContent('<div id="here"> ' + currentContent + '</div>');
        infoWindow.open(map, marker);
        infoWindow.addListener('closeclick', function() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setAnimation(null);
            }
            infoWindow.marker = null;

        });
    }
}

function mapError() {
    alert("We are expeirencing technical difficulties with Google Maps. Please try again later, for now go support your local brewery");
}