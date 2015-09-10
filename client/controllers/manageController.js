var ngapp = angular.module('manage', []);

ngapp.controller('manageController', ['$scope', '$http', function($scope, $http)
{
  //console.log('Controller is active');

  $scope.session = '';

  var getSession = function(){
    // request get user session
    $http.get('/getUserSession/').success(function(response){
      // insert extra links if admin and add name to greeting on navbar
      //console.log('Got the session');
      $scope.session = response;
    });
  };


  //loadNav();
  getSession();

  $scope.enrollmentList = '';
  $scope.userList = '';

  var getUsersAndEnrollment = function(){
    //get a list of all users and all enrollment
    $http.get('/getUserList/').success(function(response){
      // get all users from user table
      $scope.userList = response;
    });
    $http.get('/getEnrollmentList/').success(function(response){
      //get all enrollment from enrollment table
      $scope.enrollmentList = response;
    });
  }

  getUsersAndEnrollment();
}]);
