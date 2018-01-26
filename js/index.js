var app = angular.module("app", ["leaflet-directive"]);

app.controller("IndexController", ["$scope", function($scope) {
  angular.extend($scope, {
    tiles: {
      url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: {
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    }
  })
}]);
