Vehicles = new Meteor.Collection("vehicles");


Vehicles.allow({
  insert: function (userId, vehicle) {
    return false; // no cowboy inserts -- use createVehicle method
  },
  update: function (userId, vehicle, fields, modifier) {
    var allowed = ["vehicleId", "latitude", "longitude", "lastUpdate"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    // A good improvement would be to validate the type of the new
    // value of the field (and if a string, the length.) In the
    // future Meteor will have a schema system to makes that easier.
    return true;
  },
  remove: function (userId, vehicle) {
    return true;
  }
});

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

var Coordinate = Match.Where(function (x) {
  check(x, Number);
  return true;
});

var UnixTimestamp = Match.Where(function (x) {
  check(x, Number);
  return x > 1302223652000;
});

updateVehicle = function (options) {
  check(options, {
    vehicleId: NonEmptyString,
    lastUpdate: UnixTimestamp,
    latitude: Coordinate,
    longitude: Coordinate
  });

  if (options.vehicleId.length > 10)
    throw new Meteor.Error(413, "Vehicle ID too long");

  if (Vehicles.find({vehicleId:options.vehicleId}).count() > 0) {
    return Vehicles.update(
      {vehicleId: options.vehicleId},
      {$set: {lastUpdate: options.lastUpdate,
              latitude: options.latitude,
              longitude: options.longitude}});
  } else {
    return Vehicles.insert({
      vehicleId: options.vehicleId,
      lastUpdate: options.lastUpdate,
      latitude: options.latitude,
      longitude: options.longitude
    });
  }
};

Meteor.methods({
  // options should include: title, description, x, y, public
  createUpdateVehicle: function (options) {
    updateVehicle(options);
  },
});