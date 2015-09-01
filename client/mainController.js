var ngapp = angular.module('main', []);

ngapp.controller('mainController', ['$scope', '$http', function($scope, $http)
{
  //console.log('Controller is active');

  var loadNav = function() {
    $http.get('/navbar/').success(function(response){
      document.getElementById('navbar').innerHTML = response;
    });
  };


  var getSession = function(){
    // request get user session
    $http.get('/getUserSession/').success(function(response){
      // insert extra links if admin and add name to greeting on navbar
    });
  };

  loadNav();


}]);
