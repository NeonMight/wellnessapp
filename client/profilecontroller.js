var ngapp = angular.module('profile', []);

ngapp.controller('profileController', ['$scope', '$http', function($scope, $http)
{
  console.log('Controller is active');
}]);
