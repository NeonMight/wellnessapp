// this app should follow a single controller approach, or at least a single app approach
var ngapp = angular.module('main', ['ngSanitize']).directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        //console.log('Directive call');
        scope.$watch(
            function(scope) {
                // watch the 'compile' expression for changes
                //console.log('Change')
                return scope.$eval(attrs.compile);
            },
            function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);
                //console.log('Compiling...');
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
  $scope.session = '';
  $scope.currentPage = '';
  $scope.userProfile = null;


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
    console.log("Requesting resources for "+url);
    if (url=='/profile/')
    {
      console.log('Getting profile...');
      $scope.getUserProfile()
    };
  };

  // SPECIAL CASES
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
      refresh();
      //alert('Your account has been updated successfully');
      $('#submissionComplete').modal();
    });
  }


  // Load resources and templates
  $scope.getSession();
  $scope.getPage('/main/');

}]);
