var ngapp = angular.module('stats', []);

ngapp.controller('statsController', ['$scope', '$http', function($scope, $http){
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
    $http.get('/getLineChart/').success(function(response){
      Morris.Line({
        element : 'lineChart',
        data : [{y : '2013', a : '87'},{y : '2014', a : '75'},{y : '2015', a : '102'}],
        xkey : 'y',
        ykeys : ['a'],
        labels : ['Total Enrolled Employees']
      });
    });
  };


  // request all enrollment data, count each, and use data to construct morris chart

  var getPieChart = function()
  {
    $http.get('/getPieChart/').success(function(response){
    var slices = [];
    response.forEach(function(item){
      slices.push({label : item.name, value : item.quant});
    });
    Morris.Donut(
      {
        element : 'pieChart',
        //data : [{label : "Disc Bro Chill", value : 45}, {label : "CROSSFIT", value : 60}, {label : 'Srs Bizness Softball', value : 12}, {label: 'ZumbaMania', value : 30}]
        data : slices
      }
    );
  });
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
