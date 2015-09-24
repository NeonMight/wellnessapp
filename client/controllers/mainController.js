var ngapp = angular.module('main', ['ngSanitize']);

ngapp.controller('mainController', ['$scope', '$http', '$sce', function($scope, $http, $sce)
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

  $scope.getPage = function(url){
    $http.get(url).success(function(response){
      //console.log(response);
      $scope.currentPage = $sce.trustAsHtml(response);
      // now tell it to get resources for that app
    });
  };

  getSession();
  $scope.getPage('/main/');

}]);
