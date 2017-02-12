"use strict";

var moment = require("moment");
var twix = require("twix");

module.exports = ["BloodProcedure", "$timeout", function(BloodProcedure, $timeout) {
  var self = this;

  $(".nav-tabs li").removeClass("active");
  $("#home").addClass("active");

  // Load the data.
  BloodProcedure.loadAllData().then(function(data) {
    self.options = {
      chart: {
        yDomain: [80, 120],
        type: 'linePlusBarChart',
        height: 500,
        margin: {
          top: 30,
          right: 75,
          bottom: 50,
          left: 75
        },

        color: ['#2ca02c', 'darkred'],
        x: function(d, i) {
          return i
        },
        xAxis: {
          axisLabel: 'X Axis',
          tickFormat: function(d) {
            var dx = self.data[0].values[d] && self.data[0].values[d].x || 0;
            if (dx > 0) {
              return d3.time.format('%d/%b/%Y')(new Date(dx))
            }
            return null;
          }
        },
        x2Axis: {
          axisLabel: 'Select range',
          tickFormat: function(d) {
            var dx = self.data[0].values[d] && self.data[0].values[d].x || 0;
            return d3.time.format('%b-%Y')(new Date(dx))
          },
        },
        y1Axis: {
          axisLabel: 'Diastolic',
          tickFormat: function(d) {
            return d;
          },
        },
        y2Axis: {
          axisLabel: 'Systolic',
          tickFormat: function(d) {
            return d;
          },
        },
      }
    };

    self.data = [{
      key: "Diastolic",
      bar: true,
      values: BloodProcedure.collection.diastolic.avgByDay.map(function(item) {
        var timestamp = moment(item.label, "DD-MM-YYYY")._d;
        return [
          timestamp,
          item.value
        ]
      })
    }, {
      key: "Systolic",
      values: BloodProcedure.collection.systolic.avgByDay.map(function(item) {
        var timestamp = moment(item.label, "DD-MM-YYYY")._d;
        // console.log(timestamp + " - " + item.label);
        return [
          timestamp,
          item.value
        ]
      })
    }].map(function(series) {
      series.values = series.values.map(function(d) {
        return {
          x: d[0],
          y: d[1]
        }
      });
      return series;
    });

    $timeout();
  });
}];