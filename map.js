// Put your zillow.com API key here
var zwsid = "";
var request = new XMLHttpRequest();
var geocoder;
var disp='';
var marker;
var infowindow;
var addr;
var address;

function initialize () { 
}

function initMap() {
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 32.75, lng: -97.13},
    zoom: 17
  });
  marker = new google.maps.Marker({
        map: map,
  });
  google.maps.event.addListener(map, 'click', function(event) {
            var latLng=event.latLng;
            geocodeLatLng(geocoder,map,infowindow,latLng);
            }); 
}
//GeoCode
function geocodeAddress(geocoder, resultsMap,value) {  
    disp=disp+'<p>PRICE: $'+value+' '+'ADDRESS:'+address+"</p>"; 
    document.getElementById("output").innerHTML = disp;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        marker.setMap(null);
        resultsMap.setCenter(results[0].geometry.location);
        marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location,
          title: 'Price:'+value+' '+'Address:'+address
          });
        infowindow = new google.maps.InfoWindow({
        content: 'Price:'+'$'+value+'<br>'+'Address:'+address
        });
      marker.setMap(resultsMap);
      infowindow.open(resultsMap, marker);
      } else {
      console.log('Geocode was not successful for the following reason: ' + status);
    }
  });
}
//Reverse GeoCode
function geocodeLatLng(geocoder, map, infowindow, latlng) {
  var input = latlng;
  geocoder.geocode({'location': input}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        addr=results[0].formatted_address;
        address=addr;
        var newaddr=addr.split(',',3);
        var street=newaddr[0];
        var newCity=newaddr[1];
        var newStateZip=newaddr[2];
        sendNewRequest(street,newCity,newStateZip);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
} 

function displayResult () {
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        if(xml.getElementsByTagName("response")[0]){
        var value = xml.getElementsByTagName("response")[0].getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
        geocodeAddress(geocoder,map,value);
        }
    }
}

function sendNewRequest (street,newCity,newStateZip) {
    request.onreadystatechange = displayResult;
    var street = street;
    var city = newCity;
    var stateZip = newStateZip;
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+street+"&citystatezip="+city+"+"+stateZip);
    request.withCredentials = "true";
    request.send(null);
}

function sendRequest () {
  address=document.getElementById("address").value;
  var brk=address.split(',',2);
  var streetName=brk[0];
  var cityStateZip=brk[1];
    request.onreadystatechange = displayResult;
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+streetName+"&citystatezip="+cityStateZip);
    request.withCredentials = "true";
    request.send(null);
}
