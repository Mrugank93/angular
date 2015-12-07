angular.module('account.repairbits.shopcart', ['ngRoute', 'security.authorization', 'services.utility', 'services.accountResource', 'ui.bootstrap']);
angular.module('account.repairbits.shopcart').config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/account/repairbit/cart', {
      templateUrl: 'account/RepairBits/account-repairbitsCart.tpl.html',
      controller: 'AccountRepairBitsCartCtrl',
      title: 'Cart / Details',
      // resolve: {
      //   ItemDetail: ['$q', '$route', '$location', 'securityAuthorization', 'accountResource','localStorageService', function($q, $route, $location, securityAuthorization, accountResource,localStorageService){
      //     //get app stats only for account-user, otherwise redirect to /account
      //     var redirectUrl;
      //     var promise = securityAuthorization.requireVerifiedUser()
      //       .then(function(){
      //         var id = $route.current.params.id || '';
      //         // var uid =localStorageService.get("user").id;
      //         if(id){
      //           return accountResource.readProduct(id,localStorageService.get("user").id);
      //         }else{
      //           redirectUrl = '/account/store';
      //           return $q.reject();
      //         }
      //       }, function(reason){
      //         //rejected either user is un-authorized or un-authenticated
      //         redirectUrl = reason === 'unauthorized-client'? '/account/bookjobs': '/login';
      //         return $q.reject();
      //       })
      //       .catch(function(){
      //         redirectUrl = redirectUrl || '/account/store';
      //         $location.path(redirectUrl);
      //         return $q.reject();
      //       });
      //     return promise;
      //   }]
      // }
    });
}]);
angular.module('account.repairbits.shopcart').controller('AccountRepairBitsCartCtrl', ['$scope', 'DataService', '$routeParams',
  function($scope,DataService,$routeParams){
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;

  // use routing to pick the selected product
    // if ( $stateParams.productSku ) {
    //   $scope.product = $scope.store.getProduct( $stateParams.productSku );
    // }
    if ($routeParams.productSku !== null) {
        $scope.product = $scope.store.getProduct($routeParams.productSku);
    }
  }
]);