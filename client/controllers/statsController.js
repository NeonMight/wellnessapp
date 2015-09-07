var ngapp = angular.module('stats', []);

ngapp.controller('statsController', ['$scope', '$http', function($scope, $http)
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


  //loadNav();
  getSession();

  // request data and use it to construct morris chart

  var getPieChart = function()
  {
    Morris.Donut(
      {
        element : 'pieChart',
        data : [{label : "Disc Bro Chill", value : 50}, {label : "CROSSFIT", value : 50}]
      }
    );
  };

  getPieChart();

}]);
