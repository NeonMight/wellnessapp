var ngapp = angular.module('userForm', []);

ngapp.controller('userFormController', ['$scope', '$http', function($scope, $http)
{
  //console.log('Controller is active');

  $scope.session = '';

  var getSession = function(){
    // request get user session
    $http.get('/getUserSession/').success(function(response){
      // insert extra links if admin and add name to greeting on navbar
      console.log('Got the session');
      $scope.session = response;
    });
  };

  //loadNav();
  getSession();

  $scope.enrolledActivities = [];

  var refresh = function() {
    // get the enrolled activities for this user
    $http.get('/getEnrolledActivities/').success(function(response){
      $scope.enrolledActivities = response;
    });
  };

  refresh();
}]);
