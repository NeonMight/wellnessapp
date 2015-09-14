var ngapp = angular.module('manage', []);

ngapp.controller('manageController', ['$scope', '$http', function($scope, $http)
{
  //console.log('Controller is active');

  $scope.session = '';

  $scope.userMod = '';

  $scope.editUser = function(username){
    $http.get('/userModifyRequest/'+username).success(function(response){
      //console.log('Got the results');
      $scope.userMod = response[0]; //user is in array
      //console.log($scope.userMod.firstname);
      document.getElementById('updateButton').disabled = false;
    });
  };

  $scope.updateUser = function(){
    $http.put('/modifyUserAsAdmin/',$scope.userMod).success(function(response){
      $scope.userMod = '';
      document.getElementById('updateButton').disabled = true;
      $('#submissionComplete').modal();
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

  $scope.getResources = function(){
    //get a list of all users and all enrollment
    $http.get('/getUserList/').success(function(response){
      // get all users from user table
      $scope.userList = response;
    });
  }

  $scope.getResources();
}]);
