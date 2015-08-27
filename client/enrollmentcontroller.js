var ngapp = angular.module('enrollment', []);

ngapp.controller('enrollmentController', ['$scope', '$http', function($scope, $http)
{
  //console.log('Controller is active');

  $scope.activityList = [];

  $scope.enrollmentList = [];

  var loadNav = function() {
    $http.get('/navbar/').success(function(response){
      document.getElementById('navbar').innerHTML = response;
    });
  };

  var refresh = function() {
    $http.get('/getActivityList/').success(function(response){
      /*
      for (var i = 0; i < response.length; i++)
      {
        console.log("Item "+i+" pushed.");
        $scope.activityList.push(response[i]); //convert each object in array to JSON and put into scope
      }
      */
      $scope.activityList = response;
    });
  };

  $scope.enrollMe = function(id) {
    console.log('Activity '+id+' status altered');
    //reconstruct the enrollmentList
  };

  loadNav();
  refresh();

}]);
