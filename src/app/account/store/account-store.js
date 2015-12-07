angular.module('account.cart.index', ['config','security.service', 'security.authorization', 'services.accountResource', 'services.utility','ui.bootstrap', 'directives.serverError','security', 'ui.router','ngProgress']);
angular.module('account.cart.index').config(['$routeProvider', '$urlRouterProvider', '$locationProvider', function($routeProvider, $urlRouterProvider, $locationProvider){
  //$stateProvider
    $routeProvider
    .when('/account/store', {
      templateUrl: 'account/store/account-store.tpl.html',
      controller: 'AccountShopItemIndexCtrl',
      title: 'Plastifix store',
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
              redirectUrl = redirectUrl || '/account/store';
              $location.search({});
              $location.path(redirectUrl);
              return $q.reject();
            });
           
          return promise;
        }]
      },       
    });
    // .when('/account/products/:productSku', {
    //   templateUrl: 'account/store/account-products.tpl.html',
    //   controller: 'AccountCartIndexCtrl',
    //   title: 'CART product'      
    // })
    // .when('/account/cart', {
    //   templateUrl: 'account/store/account-cart.tpl.html',
    //   controller: 'AccountCartIndexCtrl',
    //   title: 'CART'      
    // });
    // .state('store', {
    //   url: '/account/store',
    //   views: {        
    //       templateUrl: '/account/store/account-store.tpl.html',
    //       controller: 'AccountCartIndexCtrl' 
    //   }, 
    //   data: { pageTitle: 'Welcome ' }            
    // });
    // $urlRouterProvider.otherwise( '/account/store' );
    $locationProvider.html5Mode(true);
}]);

angular.module('account.cart.index').controller('AccountShopItemIndexCtrl', ['$scope', 'DataService', '$routeParams','product',
  function($scope,DataService,$routeParams,data){
    
    $(".color_menu ul li a").addClass("color_3");
    $(".color_menu ul li a").removeClass("color_1");
    $("#store").removeClass("color_3");
    $("#store").addClass("color_1");
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
