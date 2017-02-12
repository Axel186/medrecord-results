'use strict';

// Load modules
import "angular";
import "angular-route";
import "angular-nvd3";

import "backbone";


// Init AngularJS application
var app = require("app");

// Set Routes
app.config(require("routes"))

// Services
app.factory("BloodProcedure", require("services/bloodProcedure"));

// Add components
app.component('homePage', require("components/home-page"));
app.component('byMonthPage', require("components/by-month-page"));