"use strict";

var constants = require("constants.js");
var bloodPressureCollection = require("models/bloodPressureCollection");

module.exports = ["$http", function($http) {
  var self = this;

  // Init Collection
  self.collection = new bloodPressureCollection();

  // Load page from API.
  self.loadData = function(page) {
    var url = constants.medrecordApi.host + "/ehr/" + constants.medrecordApi.ehr + "/procedure/bloodpressure?authToken=" + constants.medrecordApi.authToken;

    if (page) {
      url += "&page=" + page;
    }

    return $http.get(url)
      .then(function(response) {
        return response.data;
      })

    .then(function(data) {
      data.measurement.forEach(function(item) {
        var exists = self.collection.get(item.id);

        if (!exists) {
          self.collection.add(item);
        }
      });

      return data;
    });
  }

  // Load all pages from API.
  self.loadAllData = function() {
    if (self.collection.loaded) {
      return new Promise(function(resolve, reject) {
        resolve(self.collection.models);
      });
    }

    return self.loadData()
      .then(function(data) {

        var promisesAll = []
        if (data.pageCount) {
          for (var i = (data.page + 1); i <= data.pageCount; i++) {
            promisesAll.push(self.loadData(i));
          }
        }

        return Promise.all(promisesAll).then(function() {
          self.collection.sortItemsByDates();
          self.collection.loaded = true;

          console.log("Done");
        })
      })
  }

  return self;
}];