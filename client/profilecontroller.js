var ngapp = angular.module('profile', []);

ngapp.controller('profileController', ['$scope', '$http', function($scope, $http)
{
  console.log('Controller is active');

  // Now make a request for the resources with http get (refresh function for now to request resources)

  $scope.userProfile = '';

  var loadNav = function() {
    $http.get('/navbar/').success(function(response){
      document.getElementById('navbar').innerHTML = response;
    });
  };

  var refresh = function()
  {
    $http.get('/getUserProfile/').success(function(response)
    {
      $scope.userProfile = response;
    });
  };

  refresh();
  loadNav();

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
