'use strict';

var moment = require("moment");
var bloodPressureModel = require("models/bloodPressure");

module.exports = Backbone.Collection.extend({
  model: bloodPressureModel,
  modelId: function(attrs) {
    return attrs.id;
  },

  // Prepare the Collection
  initialize: function(model, options) {
    this.loaded = false;

    this.byDates = {};
    this.byMonth = {};

    this.diastolic = {
      avgByDay: [],
      avgByMonth: []
    };

    this.systolic = {
      avgByDay: [],
      avgByMonth: []
    };
  },

  // Make hashes for fast filtering.
  sortItemsByDates: function() {
    var self = this;

    this.models.forEach(function(model) {
      var date = moment(model.get("time")).format("DD-MM-YYYY");
      var month = moment(model.get("time")).format("MM-YYYY");

      self.byDates[date] = self.byDates[date] || [];
      self.byDates[date].push(model);

      self.byMonth[month] = self.byMonth[month] || [];
      self.byMonth[month].push(model);
    });

    self.calculateItemsAvg();
  },

  calculateItemsAvg: function() {
    var self = this;

    if (Object.size(self.byDates)) {
      Object.keys(self.byDates).forEach(function(key) {
        self.diastolic.avgByDay.push({
          label: key,
          value: calculateAvg(self.byDates[key], "diastolic")
        });

        self.systolic.avgByDay.push({
          label: key,
          value: calculateAvg(self.byDates[key], "systolic")
        });
      });
    }

    if (Object.size(self.byMonth)) {
      Object.keys(self.byMonth).forEach(function(key) {
        self.diastolic.avgByMonth.push({
          label: key,
          value: calculateAvg(self.byMonth[key], "diastolic")
        });

        self.systolic.avgByMonth.push({
          label: key,
          value: calculateAvg(self.byMonth[key], "systolic")
        });
      });
    }

  }
});

function calculateAvg(items, key) {
  var avg = 0;
  var count = 0;

  if (items.length) {
    items.forEach(function(item) {
      count = count + item.get(key);
    });

    avg = Math.round(count / items.length);
  }

  return avg;
}

Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};