var ngapp = angular.module('userForm', []);

ngapp.controller('userFormController', ['$scope', '$http', function($scope, $http)
{
  //console.log('Controller is active');

  var loadNav = function() {
    $http.get('/navbar/').success(function(response){
      document.getElementById('navbar').innerHTML = response;
    });
  };

  loadNav();

  $scope.enrolledActivities = [];

  var refresh = function() {
    // get the enrolled activities for this user
    $http.get('/getEnrolledActivities/').success(function(response){
      $scope.enrolledActivities = response;
    });
  };

}
