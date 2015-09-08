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

  // request all enrollment data, count each, and use data to construct morris chart

  var getPieChart = function()
  {
    Morris.Donut(
      {
        element : 'pieChart',
        data : [{label : "Disc Bro Chill", value : 50}, {label : "CROSSFIT", value : 50}]
      }
    );
  };

  //request all latest entries into enrollment dable sorted by date and return
  $scope.latestActionList = '';

  var getLatestAction = function(){
    $http.get('/getLatestAction/').success(function(response){
      $scope.latestActionList = response;
    });
  };

  getPieChart();

}]);
