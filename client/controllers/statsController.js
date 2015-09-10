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

  var getLineChart = function(){
  $http.get('/getLineChart').success(function(response){
      Morris.Line({
        element: 'lineChart',
        data: [
          { y: '4', a: 100},
          { y: '5', a: 75},
          { y: '6', a: 50},
          { y: '7', a: 75},
          { y: '8', a: 50},
          { y: '9', a: 75},
          { y: '10', a: 80}
        ],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['2015']
        });
      };
    })
  };



  // request all enrollment data, count each, and use data to construct morris chart

  var getPieChart = function()
  {
    Morris.Donut(
      {
        element : 'pieChart',
        data : [{label : "Disc Bro Chill", value : 45}, {label : "CROSSFIT", value : 60}, {label : 'Srs Bizness Softball', value : 12}, {label: 'ZumbaMania', value : 30}]
      }
    );
  };

  //request all latest entries into enrollment dable sorted by date and return
  $scope.latestActionList = '';

  var getLatestActions = function(){
    $http.get('/getLatestActions/').success(function(response){
      $scope.latestActionList = response;
    });
  };

  getLineChart();
  getPieChart();
  getLatestActions();

}]);
