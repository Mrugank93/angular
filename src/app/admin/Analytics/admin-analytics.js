angular.module('admin.analytics.index', ['config','security.service', 'security.authorization', 'services.adminResource', 'services.utility','ui.bootstrap', 'directives.serverError','security', 'ui.router','ngProgress','chart.js']);
angular.module('admin.analytics.index').config(['$routeProvider', '$urlRouterProvider', '$locationProvider', function($routeProvider, $urlRouterProvider, $locationProvider){
  //$stateProvider
    $routeProvider
    .when('/admin/analytics', {
      templateUrl: 'admin/Analytics/admin-analytics.tpl.html',
      controller: 'adminAnalyticsCtrl',
      title: 'Plastifix Analytics',
      resolve: {
        order: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource','localStorageService', function($q, $location, $log, securityAuthorization, adminResource,localStorageService){
          //get app stats only for admin-user, otherwise redirect to /admin
          var redirectUrl;
          var promise = securityAuthorization.requireVerifiedUser()
            .then(function(){
              //handles url with query(search) parameter
              //return {orderData:adminResource.findOrder($location.search(),localStorageService.get('user').id),bookjobsData:adminResource.findBookjob($location.search(),localStorageService.get('user').id)};
              return adminResource.findOrder($location.search(),localStorageService.get('user').id);
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/admin/bookjobs': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/admin/analytics';
              $location.search({});
              $location.path(redirectUrl);
              return $q.reject();
            });
           
          return promise;
        }]
      },       
    }); 
    $locationProvider.html5Mode(true);
}]);
// angular.module('admin.analytics.index').config(['ChartJsProvider', function (ChartJsProvider) {
//     // Configure all charts
//     ChartJsProvider.setOptions({
//       colours: ['#FF5252', '#FF8A80'],
//       responsive: false
//     });
//     // Configure all line charts
//     ChartJsProvider.setOptions('Line', {
//       datasetFill: false
//     });
// }]);
angular.module('admin.analytics.index').controller('adminAnalyticsCtrl', ['$scope','$routeParams','order',
  function($scope,$routeParams,datas){
    
    $(".color_menu ul li a").addClass("color_3");
    $(".color_menu ul li a").removeClass("color_1");
    $("#analytics").removeClass("color_3");
    $("#analytics").addClass("color_1");
    //console.log(datas.data);
   // console.log(JSON.parse(datas.order));
    $scope.jan=0;
    $scope.feb=0;
    $scope.mar=0;
    $scope.apr=0;
    $scope.may=0;
    $scope.jun=0;
    $scope.jul=0;
    $scope.aug=0;
    $scope.sep=0;
    $scope.oct=0;
    $scope.nov=0;
    $scope.dec=0;
    for(var i=0;i<datas.data.length;i++){
      var todayDate = moment.utc(datas.data[i].date).format('MMMM');

      // console.log(todayDate);
      if(todayDate==='January'){
        $scope.jan++;
        //console.log(jan);
      }else if(todayDate==='February'){
        $scope.feb++;
        //console.log(feb);
      }else if(todayDate==='March'){
        $scope.mar++;
        //console.log(mar);
      }else if(todayDate==='April'){
        $scope.apr++;
        //console.log(apr);
      }else if(todayDate==='May'){
        $scope.may++;
        //console.log(may);
      }else if(todayDate==='June'){
        $scope.jun++;
        console.log($scope.jul);
      }else if(todayDate==='July'){
        $scope.jul++;
        // $scope.jul=todayDate.length;
       // console.log($scope.jul);
      }else if(todayDate==='August'){
        $scope.aug++;
        //console.log(aug);
      }else if(todayDate==='Sepetember'){
        $scope.sep++;
        //console.log(sep);
      }else if(todayDate==='October'){
        $scope.oct++;
        //console.log(oct);
      }else if(todayDate==='November'){
        $scope.nov++;
        //console.log(nov);
      }else {
        $scope.dec++;
        //console.log(dec);
      }
     
    }
    $scope.labels = ["January","February","March","April","May","June","July","August","Sepetember","October","November","December"];
    $scope.series = ['Series A'];
    $scope.msg="Monthly Order Chart";
    $scope.data = [
      [$scope.jan,$scope.feb,$scope.mar,$scope.apr,$scope.may,$scope.jun,$scope.jul,$scope.aug,$scope.sep,$scope.oct,$scope.nov,$scope.dec]
    ];
//console.log($scope.jul);


  
    // var deserializeData = function(data){  
    
    //   $scope.items = data.items;
    //   $scope.pages = data.pages;
    //   $scope.filters = data.filters;     
    //   $scope.shopItems = data.data;   
    //   //console.log($scope.shopItems);
    // };        

   // deserializeData(data);
  }
]);
