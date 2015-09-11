var ngapp = angular.module('manage', []);

ngapp.controller('manageController', ['$scope', '$http', function($scope, $http)
{
  //console.log('Controller is active');

  $scope.session = '';

  $scope.userMod = '';

  $scope.editUser = function(username){
    $http.get('/userModifyRequest/'+username).success(function(response){
      $scope.userMod = response;
      document.getElementById('updateButton').disabled = false;
    });
  };

  $scope.updateUser = function(){
    $http.put('/modifyUserAsAdmin/', $scope.userMod).success(function(response){
      refresh();
      $scope.userMod = '';
      document.getElementById('updateButton').disabled = true;
    })
  }

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
  }

  getUsersAndEnrollment();
}]);
