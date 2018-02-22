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
  var serverUrl = "http://localhost:3000/todo/";
  $scope.markers = new Array();

  $http.get(serverUrl).then(loadTodos,errorMessage); //Get tasks

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
    $http.get(urlString).then(addMarker,errorMessage);
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
    $("#modal").on('click','#btnClose',function(){
      //console.log(marker[]);
      $http.post(serverUrl,marker).then(postSuccess,errorMessage);
      marker = {};
    })
  }


  $scope.remove = function(index) {
    if (index != -1) {
      var id = $scope.markers[index]._id;
      console.log(id);
      $http.delete(serverUrl+id).then(function(){
        $http.get(serverUrl).then(loadTodos,errorMessage);
      },errorMessage);
    }
  }
  function loadTodos(response){
    //console.log(response);
    if(response.data.length>0){
      console.log(response.data);
      $scope.markers = response.data;
    }
    else{
      $scope.currentMarker = [];
    }
  }
  function postSuccess(response){
    //console.log(response);
    $http.get(serverUrl).then(loadTodos,errorMessage);
  }
  function errorMessage(error){
      console.log(error);
  }
  $scope.info = function(index) {
    var m = {
      lat: parseFloat($scope.markers[index].lat),
      lng: parseFloat($scope.markers[index].lng),
      title: $scope.markers[index].title,
      dueDate: new Date($scope.markers[index].dueDate),
      address: $scope.markers[index].address
    };
    $scope.currentMarker = m;
    //console.log(m);
    $("#modal").on('click','#btnClose',function(){
      //console.log($scope.markers[index]._id);
      //console.log(marker[]);
      $http.put(serverUrl+$scope.markers[index]._id,m).then(taskPostSuccess,errorMessage);
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
  }


}]);
