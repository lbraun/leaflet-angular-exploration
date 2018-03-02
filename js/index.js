var app = angular.module("app", ["leaflet-directive"]);

app.controller("IndexController", ["$scope", "$http", 'leafletData', function($scope, $http, leafletData) {
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
  var icons = {
    default_marker: {},
    expired_marker: {
      iconUrl: '../icons/red_marker.png',
      iconSize: [45, 45], // size of the icon
    },
    upcoming_marker: {
      iconUrl: '../icons/blue_marker.png',
      iconSize: [45, 45], // size of the icon
    }
  }
  var serverUrl = "http://localhost:3000/todo/";
  $scope.markers = new Array();
  $scope.counter = 0;
  $http.get(serverUrl).then(loadTodos, errorMessage); //Get tasks

  $scope.$on("leafletDirectiveMarker.dragend", function(event, args) {
    var marker = {
      lat: parseFloat(args.model.lat),
      lng: parseFloat(args.model.lng),
      title: args.model.title,
      dueDate: new Date(args.model.dueDate),
      address: args.model.address
    };
    $scope.currentMarker = marker;
    $http.put(serverUrl + args.model._id, marker).then(postSuccess, errorMessage);
  });
  $scope.$on("leafletDirectiveMap.mousedown", function(event, args) {
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
    $http.get(urlString).then(addMarker, errorMessage);
  }

  function addMarker(response) {
    var marker = {
      lat: parseFloat(response.data.lat),
      lng: parseFloat(response.data.lon),
      title: "New entry",
      dueDate: new Date(),
      address: response.data.display_name
    };

    $scope.currentMarker = marker;
    $("#modal").modal('show');
    $("#modal").on('click', '#btnCancel', function() {
      marker = {};
    })
    $("#modal").on('click', '#btnSave', function() {
      $http.post(serverUrl, marker).then(postSuccess, errorMessage);
      marker = {};
    })
    $('#modal').on('hidden.bs.modal', function() {
      marker = {};
    })
  }
  $scope.remove = function(index) {
    var id = $scope.markers[index]._id;
    $http.delete(serverUrl + id).then(function() {
      if ($scope.markers.length == 1) {
        $scope.counter = 0;
        window.location.reload();
      } else {
        $http.get(serverUrl).then(loadTodos, errorMessage);
      }
    }, errorMessage);
  }

  function loadTodos(response) {
    $scope.counter = response.data.length;
    if (response.data.length > 0) {
      $scope.markers = response.data;
      var dateString;
      $($scope.markers).each(function(index, marker) {
        dateString = new Date(marker.dueDate).toGMTString()
        dateString = dateString.substring(0, dateString.length - 4);
        $scope.markers[index].message = "<b>Title: </b>" + marker.title + "<br/><b>Due Date: </b>" + dateString;
        if(new Date(marker.dueDate) > new Date()){
          $scope.markers[index].icon = icons.upcoming_marker;
          $scope.markers[index].draggable = true;
        }
        else{
          $scope.markers[index].icon = icons.expired_marker;
        }
      });
    } else {
      $scope.currentMarker = [];
    }
  }

  function postSuccess(response) {
    $http.get(serverUrl).then(loadTodos, errorMessage);
  }

  function errorMessage(error) {
    console.log(error);
  }
  $scope.edit = function(index) {
    var marker = {
      lat: parseFloat($scope.markers[index].lat),
      lng: parseFloat($scope.markers[index].lng),
      title: $scope.markers[index].title,
      dueDate: new Date($scope.markers[index].dueDate),
      address: $scope.markers[index].address
    };
    $scope.currentMarker = marker;
    $("#modal").on('click', '#btnSave', function() {
      $http.put(serverUrl + $scope.markers[index]._id, marker).then(postSuccess, errorMessage);
    })
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
    var popup = L.popup().setLatLng([$scope.markers[index].lat, $scope.markers[index].lng])
      .setContent($scope.markers[index].message);
    leafletData.getMap("leafletDirectiveMap").then(function(map) {
      popup.openOn(map);
    });
  }
}]);
