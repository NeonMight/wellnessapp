var ngapp = angular.module('profile', []);

ngapp.controller('profileController', ['$scope', '$http', function($scope, $http)
{
  console.log('Controller is active');

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

  // Now make a request for the resources with http get (refresh function for now to request resources)

  $scope.userProfile = '';

  var refresh = function()
  {
    $http.get('/getUserProfile/').success(function(response)
    {
      $scope.userProfile = response;
    });
  };

  refresh();

  $scope.updateInfo = function()
  {
    $http.put('/updateProfile/',$scope.userProfile).success(function(response)
    {
      //do something
      refresh();
      alert('Your account has been updated successfully');
    });
  }

}]);
