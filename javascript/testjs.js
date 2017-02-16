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

allBreweries.query = ko.observable('');

allBreweries.filteredBreweries = ko.observableArray([]);

allBreweries.search = ko.computed(function(){
  //console.log(allBreweries.query());
  var query = allBreweries.query().toLowerCase();
  allBreweries.filteredBreweries([]);
  console.log(query);
  allBreweries.breweries().forEach(function(brewery){
    //console.log(brewery);
    //console.log(brewery.name.indexOf(query));
    var name = brewery.name.toLowerCase();
    var match = name.indexOf(query);
    console.log(name, query, match);
    if (match> -1) {
      allBreweries.filteredBreweries.push(brewery);
    }

  });

});



ko.applyBindings(allBreweries);








