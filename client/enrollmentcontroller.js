var ngapp = angular.module('enrollment', []);

ngapp.controller('enrollmentController', ['$scope', '$http', function($scope, $http)
{
  //console.log('Controller is active');

  $scope.activityList = '';

  var loadNav = function() {
    $http.get('/navbar/').success(function(response){
      document.getElementById('navbar').innerHTML = response;
    });
  };

  var refresh = function() {
    $http.get('/getActivityList/').success(function(response){
      // do something
      console.log("Object 1: "+JSON.stringify(response[0]));
      $scope.activityList = response;
    });
  }

  loadNav();
  refresh();
}]);
