'use strict';

module.exports = ['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.
    when('/home', {
      template: '<home-page></home-page>'
    }).
    when('/byMonth', {
      template: '<by-month-page></by-month-page>'
    }).
    
    otherwise('/home');
  }
];