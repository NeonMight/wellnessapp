var ngapp = angular.module('main', ['ngSanitize']);

ngapp.controller('mainController', ['$scope', '$http', function($scope, $http)
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

  $scope.currentPage = '';

  $scope.getCurrentPage = function(){
    $http.get('/main/').success(function(response){
      // you will need to explicitly escape the response with sce
      $scope.currentPage = response;
    });
  };


  getSession();
  $scope.getCurrentPage();

}]);
