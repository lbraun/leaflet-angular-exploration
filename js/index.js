var app = angular.module("app", ["leaflet-directive"]);

app.controller("IndexController", ["$scope", function($scope) {
  angular.extend($scope, {
    center: {
        lat: 39.98685368305097,
        lng: -0.04566192626953125,
        zoom: 15
    },
    tiles: {
      url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: {
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    }
  })

  $scope.markers = new Array();

  $scope.$on("leafletDirectiveMap.mousedown", function (event,args) {
    var mouseButton = args.leafletEvent.originalEvent.button;

    if (mouseButton == 2) { // Right button
      var latlng = args.leafletEvent.latlng;

      $scope.markers.push({
        lat: latlng.lat,
        lng: latlng.lng,
        message: "New entry",
        dueDate: new Date()
      });

      $scope.currentMarker = $scope.markers[$scope.markers.length - 1]
      $("#modal").modal('show');
    }
  });

  $scope.currentMarker = {};

  $scope.showInfo = function(index) {
    $scope.currentMarker = $scope.markers[index];
  }

  $scope.show = function(index) {
    $.each($scope.markers, function(i, marker) {
      marker.focus = i == index;
    });

    $scope.center = {
      lat: $scope.markers[index].lat,
      lng: $scope.markers[index].lng,
      zoom: 15
    };
  }

  $scope.remove = function(index) {
    if (index !== -1) {
      $scope.markers.splice(index, 1);
    }
  }
}]);
