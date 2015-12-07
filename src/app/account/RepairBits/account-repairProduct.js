angular.module('account.repairbits.detail', ['ngRoute', 'security.authorization', 'services.utility', 'services.accountResource', 'ui.bootstrap']);
angular.module('account.repairbits.detail').config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/account/repairbit/products/:id', {
      templateUrl: 'account/RepairBits/account-repairProducts.tpl.html',
      controller: 'accountEditRepairBitsCtrl',
      title: 'Item / Details',
      resolve: {
        ItemDetail: ['$q', '$route', '$location', 'securityAuthorization', 'accountResource','localStorageService', function($q, $route, $location, securityAuthorization, accountResource,localStorageService){
          //get app stats only for account-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireVerifiedUser()
            .then(function(){
              var id = $route.current.params.id || '';
              // var uid =localStorageService.get("user").id;
              if(id){
                return accountResource.readProduct(id,localStorageService.get("user").id);
              }else{
                redirectUrl = '/account/repairbit';
                return $q.reject();
              }
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/account/bookjobs': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/account/repairbit';
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      }
    });
}]);

angular.module('account.repairbits.detail').controller('accountEditRepairBitsCtrl', ['$routeParams','$scope', '$route', '$location', '$log', 'utility', 'accountResource', 'ItemDetail','localStorageService','$routeParams','DataService',
  function($routeParams,$scope, $route, $location, $log, utility, accountResource, data, localStorageService,$routeParams,DataService) {
    // local vars
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;
    // if ($routeParams.productSku !== null) {
    //     $scope.product = $scope.store.getProduct($routeParams.productSku);
    // }
    var deserializeData = function(data){
      $scope.ItemDetail = data;      
      //console.log($scope.ItemDetail);
    };
      
   

    var closeAlert = function(alert, ind){
      alert.splice(ind, 1);
    };
    //$scope vars
    $scope.detailAlerts = [];
    $scope.deleteAlerts = [];
    $scope.canSave = utility.canSave;
    $scope.hasError = utility.hasError;
    $scope.showError = utility.showError;
    $scope.closeDetailAlert = function(ind){
      closeAlert($scope.detailAlerts, ind);
    };
    $scope.closeDeleteAlert = function(ind){
      closeAlert($scope.deleteAlerts, ind);
    };
    $scope.editProduct=function(){
      $scope.detailAlerts = [];
      var data={
        productName:$scope.editItemDetail.productName,
        reference:$scope.editItemDetail.reference,
        price:$scope.editItemDetail.price,
        userID      : localStorageService.get("user").id
      };
      console.log($scope.editItemDetail._id);
      accountResource.updateProduct($scope.editItemDetail._id, data).then(function(result){
        if(result.success){
          console.log($scope.editItemDetail._id);
          deserializeData(result.editItemDetail);
          //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
           $location.path('/account/store');
        }else{

          angular.forEach(result.errors, function(err, index){
            console.log(err);
            $scope.detailAlerts.push({ type: 'danger', msg: err });
          });
        }        
      }, function(x){
        $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating Products: ' + x });
      });
    };
    $scope.deleteProduct = function(){
      $scope.deleteAlerts =[];
      if(confirm('Are you sure?')){
        accountResource.deleteProduct($scope.editItemDetail._id,localStorageService.get("user").id).then(function(result){
          if(result.success){
            //redirect to account bookjobs index page
            $location.path('/account/store');
          }else{
            //error due to server side validation
            angular.forEach(result.errors, function(err, index){
              $scope.deleteAlerts.push({ type: 'danger', msg: err});
            });
          }
        }, function(x){
          $scope.deleteAlerts.push({ type: 'danger', msg: 'Error deleting bookjobs: ' + x });
        });
      }
    };

    //initialize
    deserializeData(data);
  }
]);

