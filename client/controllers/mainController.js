// this app should follow a single controller approach, or at least a single app approach
// compile directive taken from stackoverflow.com
var ngapp = angular.module('main', ['ngSanitize']).directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);
                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}]);

ngapp.controller('mainController', ['$scope', '$http', '$sce', '$compile', function($scope, $http, $sce, $compile)
{
  //console.log('Controller is active');

  // SCOPE DATA MEMBERS
  $scope.session = null;
  $scope.currentPage = null;
  $scope.userProfile = null;
  $scope.activityList = [];
  $scope.enrollmentList = [];
  $scope.enrolledActivities = [];
  $scope.userList = [];
  $scope.userMod = null;
  $scope.latestActionList = [];
  $scope.waiver = false;
  $scope.userModEnrollmentList = [];
  $scope.userCreditPercentage = {credit: 0}


  // SCOPE ACTIONS
  $scope.getSession = function(){
    // request get user session
    $http.get('/getUserSession/').success(function(response){
      // insert extra links if admin and add name to greeting on navbar
      //console.log('Got the session');
      $scope.session = response;
    });
  };

  $scope.getPage = function(url){
    $http.get(url).success(function(response){
      //console.log(response);
      // $scope.currentPage = $sce.trustAsHtml(response);
      $scope.currentPage = response; // no more sce; compile directive handles template
      // now tell it to get resources for that app
      $scope.getResources(url);
    });
  };

  $scope.getResources = function(url){
    //depending on page loaded, get the resources for that page
    //console.log("Requesting resources for "+url);
    switch(url){
      case "/main/":
        break;
      case "/profile/":
        $scope.getUserProfile();
        break;
      case "/enroll/":
        $scope.getActivityList();
        break;
      case "/form/":
        $scope.getEnrolledActivities();
        break;
      case "/manage/":
        $scope.getUserList();
        break;
      case "/activities/":
        $scope.manageActivities();
        break;
      case "/stats/":
        $scope.dashboard();
        break;
      case "/waiver/":
        break;
      default:
        console.log("Invalid url");
    }
  };

  // USER PROFILE CASE
  $scope.getUserProfile = function()
  {
    $http.get('/getUserProfile/').success(function(response)
    {
      $scope.userProfile = response;
    });
  };

  $scope.updateUserProfile = function()
  {
    $http.put('/updateProfile/',$scope.userProfile).success(function(response)
    {
      //do something
      $scope.getUserProfile();
      //alert('Your account has been updated successfully');
      $('#submissionComplete').modal();
    });
  }

  // ENROLLMENT CASE
  $scope.getActivityList = function(){
    $http.get('/getActivityListUnenrolled/').success(function(response){
      $scope.enrollmentList = [];
      $scope.activityList = response;
      for (var i = 0; i < $scope.activityList.length; i++)
      {
        $scope.enrollmentList.push(false); // all turned off initially
      }
    });
  };

  $scope.enroll = function(){
    //collect all true elements in the enrollment list, use the indexes to reference the activity list, and submit to server
    //console.log($scope.activityList.length == $scope.enrollmentList.length) //check if lengths are the same first
    for (var i = 0; i < $scope.activityList.length; i++)
    {
      if ($scope.enrollmentList[i] == true) {
        //console.log("You are to be enrolled in: "+$scope.activityList[i].name)
        $http.post('/enrollUser/', $scope.activityList[i]).success(function(response){
          //console.log("Enrolled successfully");
        });
      }
    }
    // trigger modal
    $('#submissionComplete').modal();
  };

  $scope.viewEvents = function(id){
    $http.get('/viewEvents/'+id).success(function(response){
      $scope.eventList = response;
      $('#eventDetail').modal();
    });
  };

  // FORM CASE
  $scope.getEnrolledActivities = function(){
    $http.get('/getEnrolledActivities/').success(function(response){
      $scope.enrolledActivities = response;
    });
  };

  //MANAGE CASE
  $scope.getUserList = function(){
    $http.get('/getUserList/').success(function(response){
      $scope.userList = response;
    });
  };

  $scope.viewEnrollmentForUser = function(username){
    $http.get('/viewEnrollmentForUser/'+username).success(function(response){
      // possible need to coerce boolean values to numerical or something
      $scope.userCreditPercentage = {credit : 0}
      $scope.userModEnrollmentList = response;
      $scope.userModEnrollmentList.forEach(function(member){
        //console.log(member.complete);
        //console.log(member.percent);
        member.complete = Boolean(member.complete); //ng-model doesn't like ints for boolean
        if (member.complete == true) $scope.userCreditPercentage.credit += member.percent;
      });
      $('#userEnrollment').modal();
    });
  };

  $scope.alterStatus = function(){
    // on change, add and validate
    console.log('Status has been altered');
  };

  $scope.updateEnrollmentStatus = function(){
    $scope.userModEnrollmentList.forEach(function(activity){
      //console.log(activity);
      //console.log(activity.user);
      $http.put('/updateEnrollmentStatus/', activity).success(function(response){
        // do nothing
      });
    });
  };

  $scope.editUser = function(username){
    $http.get('/userModifyRequest/'+username).success(function(response){
      //console.log('Got the results');
      $scope.userMod = response[0]; //user is in array
      //console.log($scope.userMod.firstname);
      document.getElementById('updateButton').disabled = false;
    });
  };

  //ACTIVITIES CASE
  $scope.manageActivities = function(){

  };

  //STATS CASE
  $scope.dashboard = function(){
    // get latest actions, pieChart, and lineChart
    $scope.getLatestActions();
    $scope.getPieChart();
    $scope.getLineChart();
  };

  $scope.getLatestActions = function(){
    $http.get('/getLatestActions/').success(function(response){
      $scope.latestActionList = response;
    });
  }

  $scope.getPieChart = function(){
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

 $scope.getLineChart = function(){
    $http.get('/getLineChart/').success(function(response){
      var points = [];
      response.forEach(function(item){
        points.push({y : item.year.toString(), a : item.quant.toString()});
      });
      // points = [{y : '2013', a : '87'},{y : '2014', a : '75'},{y : '2015', a : '102'}]
      Morris.Line({
        element : 'lineChart',
        //data : [{y : '2013', a : '87'},{y : '2014', a : '75'},{y : '2015', a : '102'}],
        data : points,
        xkey : 'y',
        ykeys : ['a'],
        labels : ['Total Enrolled Employees']
      });
    });
  };

  //WAIVER CASE
  $scope.decline = function(){
    $http.post('/waiveParticipation/').success(function(response){
      // do nothing with response and trigger modal
      $('#submissionComplete').modal();
    });
  }

  // Load resources and templates
  $scope.getSession();
  $scope.getPage('/main/');

}]);
