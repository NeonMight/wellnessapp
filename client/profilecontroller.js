var ngapp = angular.module('profile', []);

ngapp.controller('profileController', ['$scope', '$http', function($scope, $http)
{
  console.log('Controller is active');

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

}]);
