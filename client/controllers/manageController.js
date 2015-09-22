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

  $scope.enrollmentList = [];
  $scope.userList = [];

  $scope.getResources = function(){
    //get a list of all users and all enrollment
    $http.get('/getUserList/').success(function(response){
      // get all users from user table
      $scope.userList = response;
    });
  }

  $scope.getResources();

  $scope.viewEnrollmentForUser = function(username){
    $scope.enrollmentList = [];
    $http.get('/viewEnrollmentForUser/'+username).success(function(response){
      $scope.enrollmentList = response;
      $('#userEnrollment').modal();
    })
  }

  $scope.updateEnrollmentStatus = function(){
    // send all activities (that have changed) that are in the enrollmentList
    $scope.enrollmentList.forEach(function(activity){
      //console.log(activity);
      //console.log(activity.user);
      $http.put('/updateEnrollmentStatus/', activity).success(function(response){
        // do nothing
      });
    });
    //console.log('Time to updoot the status!');
  };
}]);
