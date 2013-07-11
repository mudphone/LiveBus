// server: populate collections with some initial documents
// Vehicles.insert({vehicleId: ""});
// var myVehicles = Vehicles.find({}).fetch();

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