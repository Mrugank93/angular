angular.module('account.repairbits.index', ['config','security.service', 'security.authorization', 'services.accountResource', 'services.utility','ui.bootstrap', 'directives.serverError','security', 'ui.router','ngProgress']);
angular.module('account.repairbits.index').config(['$routeProvider', '$urlRouterProvider', '$locationProvider', function($routeProvider, $urlRouterProvider, $locationProvider){
  //$stateProvider
    $routeProvider
    .when('/account/repairbit', {
      templateUrl: 'account/RepairBits/account-repairBitstore.tpl.html',
      controller: 'AccountRepairBitsIndexCtrl',
      title: 'Plastifix RepairBits',
       resolve: {
        product: ['$q', '$location', '$log', 'securityAuthorization', 'accountResource','localStorageService', function($q, $location, $log, securityAuthorization, accountResource,localStorageService){
          //get app stats only for account-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireVerifiedUser()
            .then(function(){
              //handles url with query(search) parameter
              return accountResource.findProduct($location.search(),localStorageService.get('user').id);

            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/account/bookjobs': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/account/repairbit';
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

angular.module('account.repairbits.index').controller('AccountRepairBitsIndexCtrl', ['$scope', 'DataService', '$routeParams','product',
  function($scope,DataService,$routeParams,data){
    
    $(".color_menu ul li a").addClass("color_3");
    $(".color_menu ul li a").removeClass("color_1");
    $("#repairbits").removeClass("color_3");
    $("#repairbits").addClass("color_1");
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;
    //console.log(data);
    var deserializeData = function(data){  
    
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;     
      $scope.shopItems = data.data;   
      //console.log($scope.shopItems);
    };
        
  // use routing to pick the selected product
    // if ( $stateParams.productSku ) {
    //   $scope.product = $scope.store.getProduct( $stateParams.productSku );
    // }
    if ($routeParams.productSku !== null) {
        $scope.product = $scope.store.getProduct($routeParams.productSku);
    }
    deserializeData(data);
  }
]);
