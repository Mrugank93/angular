angular.module('account.analytics.index', ['config','security.service', 'security.authorization', 'services.accountResource', 'services.utility','ui.bootstrap', 'directives.serverError','security', 'ui.router','ngProgress']);
angular.module('account.analytics.index').config(['$routeProvider', '$urlRouterProvider', '$locationProvider', function($routeProvider, $urlRouterProvider, $locationProvider){
  //$stateProvider
    $routeProvider
    .when('/account/analytics', {
      templateUrl: 'account/Analytics/account-analytics.tpl.html',
      controller: 'AccountAnalyticsCtrl',
      title: 'Plastifix Analytics',
      // resolve: {
      //   product: ['$q', '$location', '$log', 'securityAuthorization', 'accountResource','localStorageService', function($q, $location, $log, securityAuthorization, accountResource,localStorageService){
      //     //get app stats only for account-user, otherwise redirect to /account
      //     var redirectUrl;
      //     var promise = securityAuthorization.requireVerifiedUser()
      //       .then(function(){
      //         //handles url with query(search) parameter
      //         return accountResource.findProduct($location.search(),localStorageService.get('user').id);

      //       }, function(reason){
      //         //rejected either user is un-authorized or un-authenticated
      //         redirectUrl = reason === 'unauthorized-client'? '/account/bookjobs': '/login';
      //         return $q.reject();
      //       })
      //       .catch(function(){
      //         redirectUrl = redirectUrl || '/account/analytics';
      //         $location.search({});
      //         $location.path(redirectUrl);
      //         return $q.reject();
      //       });
           
      //     return promise;
      //   }]
      // },       
    }); 
    $locationProvider.html5Mode(true);
}]);

angular.module('account.analytics.index').controller('AccountAnalyticsCtrl', ['$scope','$routeParams',
  function($scope,$routeParams){
    
    $(".color_menu ul li a").addClass("color_3");
    $(".color_menu ul li a").removeClass("color_1");
    $("#analytics").removeClass("color_3");
    $("#analytics").addClass("color_1");
    
    //var ctx = $("#myChart").get(0).getContext("2d");
      // This will get the first returned node in the jQuery collection.
    //var myNewChart = new Chart(ctx);

    // var randomScalingFactor = function(){ 
    //   return Math.round(Math.random()*100);
    // };
    //     var barChartData = {
    //       labels : ["January","February","March","April","May","June","July","August","Sepetember","October","November","December"],
    //       datasets : [
    //         {
    //           fillColor : "rgba(220,220,220,0.5)",
    //           strokeColor : "rgba(220,220,220,0.8)",
    //           highlightFill: "rgba(220,220,220,0.75)",
    //           highlightStroke: "rgba(220,220,220,1)",
    //           data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
    //         },
    //         {
    //           fillColor : "rgba(151,187,205,0.5)",
    //           strokeColor : "rgba(151,187,205,0.8)",
    //           highlightFill : "rgba(151,187,205,0.75)",
    //           highlightStroke : "rgba(151,187,205,1)",
    //           data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
    //         }
    //       ]
    //     };
    //   window.onload = function(){
    //     var ctx = document.getElementById("canvas").getContext("2d");
    //     window.myBar = new Chart(ctx).Bar(barChartData, { responsive : true});
    //   };
      // var pieData = [
      //   {
      //     value: 300,
      //     color:"#F7464A",
      //     highlight: "#FF5A5E",
      //     label: "Red"
      //   },
      //   {
      //     value: 50,
      //     color: "#46BFBD",
      //     highlight: "#5AD3D1",
      //     label: "Green"
      //   },
      //   {
      //     value: 100,
      //     color: "#FDB45C",
      //     highlight: "#FFC870",
      //     label: "Yellow"
      //   },
      //   {
      //     value: 40,
      //     color: "#949FB1",
      //     highlight: "#A8B3C5",
      //     label: "Grey"
      //   },
      //   {
      //     value: 120,
      //     color: "#4D5360",
      //     highlight: "#616774",
      //     label: "Dark Grey"
      //   }
      // ];
      // window.onload = function(){
      //   var ctx = document.getElementById("chart-area").getContext("2d");
      //   window.myPie = new Chart(ctx).Pie(pieData);
      // };
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
