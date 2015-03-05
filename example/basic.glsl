// importd the module 
var mdns = require('mdns');
 
// advertise a http server on port 4321 
var serviceType = mdns.makeServiceType('shadrr', 'tcp');
var ad = mdns.createAdvertisement(serviceType, 4321);
ad.start();
 
// watch all http servers 
var browser = mdns.createBrowser(serviceType);
browser.on('serviceUp', function(service) { 
  console.log("service up: ", service); 
});
browser.on('serviceDown', function(service) {
  console.log("service down: ", service);
});
browser.start();
 
// discover all available service types 
var all_the_types = mdns.browseThemAll(); // all_the_types is just another browser...
/*
var mdns = require('multicast-dns')()

mdns.on('response', function(response) {
  console.log('got a response packet:', JSON.stringify(response))
})

mdns.on('query', function(query) {
  console.log('got a query packet:', query)
})

// lets query for an A record for 'brunhilde.local'
mdns.query({
  questions: [{name:"_shadrr._tcp", type:'ANY'}]
})*/