var path = Npm.require('path');
var fs = Npm.require('fs');
var base = path.resolve('.');
var isBundle = fs.existsSync(base + '/bundle');
var modulePath = base + (isBundle ? '/bundle/static' : '/public') + '/node_modules';
ProtoBuf = Npm.require(modulePath + '/protobufjs'); // NOTE, this is going to be a global variable
var builder = ProtoBuf.protoFromFile(base + "/public/data/gtfs-realtime.proto");
if (_U.existy(builder)) {
  console.log("builer ->");
  console.log(builder);
} else {
  console.log("no builder!");
}

var http = Npm.require('http');

Meteor.startup(function () {

  var options = {
    hostname: 'webapps.thebus.org',
    port: 80,
    path: '/transitdata/production/vehloc/',
    method: 'GET'
  };
  var req = http.get(options, function (res) {
    var data = [];

    res.on('data', function (chunk) {
      data.push(chunk);

    }).on('end', function() {
      //at this point data is an array of Buffers
      //so we take each octet in each of the buffers
      //and combine them into one big octet array to pass to a
      //new buffer instance constructor
      var buffer = new Buffer(data.reduce(function(prev, current) {
          return prev.concat(Array.prototype.slice.call(current));
        }, []));
      var GTFSRealTime = builder.build("transit_realtime");
      var decoder = GTFSRealTime.FeedMessage;
      var buff = new Buffer(buffer, "base64");
      console.log("Buffer.isBuffer: " + Buffer.isBuffer(buff));
      var msg = decoder.decode(buff);
      // console.log(msg);
      console.log(msg.entity[0].vehicle);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.end();
});


// Honolulu:
// Meteor.call('createUpdateVehicle', { vehicleId: "123", lastUpdate: Date.now(), latitude: 21.3069, longitude: -157.9583 })

// Waipahu 21.3867° N, 158.0092° W
// Meteor.call('createUpdateVehicle', { vehicleId: "456", lastUpdate: Date.now(), latitude: 21.3867, longitude: -158.0092 })

// Wahiawa 21.5028° N, 158.0236° W
// Meteor.call('createUpdateVehicle', { vehicleId: "789", lastUpdate: Date.now(), latitude: 21.5028, longitude: -158.0236 })

// server: publish all room documents
Meteor.publish("vehicles", function () {
  return Vehicles.find(); // everything
});