var app = angular.module("app", ["leaflet-directive"]);

app.controller("IndexController", ["$scope", "$http", function($scope, $http) {
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
  $scope.counter = 0;
  $scope.$on("leafletDirectiveMap.mousedown", function (event,args) {
    var mouseButton = args.leafletEvent.originalEvent.button;

    if (mouseButton == 2) { // Right button
      var latlng = args.leafletEvent.latlng;
      reverseGeocoding(latlng);
    }
  });

  function reverseGeocoding(latlng) {
    var urlString = "http://nominatim.openstreetmap.org/reverse?format=json&lat=" +
    latlng.lat + "&lon=" +
    latlng.lng + "&zoom=18&addressdetails=1";
    $http.get(urlString).then(addMarker);
  }

  function addMarker(response) {
    var marker = {
      lat: parseFloat(response.data.lat),
      lng: parseFloat(response.data.lon),
      message: "New entry",
      dueDate: new Date(),
      address: response.data.display_name
    };
    $scope.counter++;
    $scope.markers.push(marker);
    $scope.currentMarker = marker;
    $("#modal").modal('show');
  }

  $scope.info = function(index) {
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
        $scope.counter--;
    }
  }
}]);
