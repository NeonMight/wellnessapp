var ngapp = angular.module('enrollment', []);

ngapp.controller('enrollmentController', ['$scope', '$http', function($scope, $http)
{
  //console.log('Controller is active');

  $scope.activityList = [];

  $scope.enrollmentList = [];

  $scope.session = '';

  var getSession = function(){
    // request get user session
    $http.get('/getUserSession/').success(function(response){
      // insert extra links if admin and add name to greeting on navbar
      console.log('Got the session');
      $scope.session = response;
    });
  };


  //loadNav();
  getSession();

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
      for (var i = 0; i < $scope.activityList.length; i++)
      {
        $scope.enrollmentList.push(false); // all turned off initially
      }
    });
  };

  $scope.alterMe = function(id) {
    console.log('Activity '+id+' status altered');
    //$scope.enrollmentList[id] = !$scope.enrollmentList[id]; // negate the current state (ng-model takes care of this)
    console.log('Activity status: '+$scope.enrollmentList);
  };

  $scope.enroll = function(){
    //collect all true elements in the enrollment list, use the indexes to reference the activity list, and submit to server
    //console.log($scope.activityList.length == $scope.enrollmentList.length) //check if lengths are the same first
    for (var i = 0; i < $scope.activityList.length; i++)
    {
      if ($scope.enrollmentList[i] == true) {
        console.log("You are to be enrolled in: "+$scope.activityList[i].name)
        $http.post('/enrollUser/', $scope.activityList[i]).success(function(response){
          console.log("Enrolled successfully");
        });
      // redirect to form.html
      }
    };
  };
  refresh();

}]);
