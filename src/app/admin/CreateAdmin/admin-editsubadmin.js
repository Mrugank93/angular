angular.module('admin.subAdmin.editdetail', ['ngRoute', 'security.authorization', 'services.utility', 'services.adminResource', 'ui.bootstrap']);
angular.module('admin.subAdmin.editdetail').config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/admin/subadmin/:id', {
      templateUrl: 'admin/CreateAdmin/admin-editsubadmin.tpl.html',
      controller: 'AdminEditSubAdminCtrl',
      title: 'SubAdmin / Details',
      resolve: {
        editSubAdmin: ['$q', '$route', '$location', 'securityAuthorization', 'adminResource','localStorageService', function($q, $route, $location, securityAuthorization, adminResource,localStorageService){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              var id = $route.current.params.id || '';
              // var uid =localStorageService.get("user").id;
              if(id){
                return adminResource.readsubAdmin(id,localStorageService.get("user").id);
              }else{
                redirectUrl = '/admin/subadmin';
                return $q.reject();
              }
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/admin/bookjobs': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/admin/bookjobs';
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      }
    });
}]);
angular.module('admin.subAdmin.editdetail').controller('AdminEditSubAdminCtrl', ['$routeParams','$scope', '$route', '$location', '$log', 'utility','adminResource', 'editSubAdmin','localStorageService','$modal',
  function($routeParams,$scope, $route, $location, $log, utility, adminResource, data, localStorageService,$modal) {
    // local vars
    //console.log(data);
    var deserializeData = function(data){
      $scope.editSubAdminDetail = data;      
      //console.log($scope.editSubAdminDetail);
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
  
 
    $scope.EditSubAdmin=function(){
      $scope.detailAlerts = [];     
          var data={
            email       :$scope.editSubAdminDetail.email,
            password    :$scope.editSubAdminDetail.password,
            name        :$scope.editSubAdminDetail.name,
            phone       :$scope.editSubAdminDetail.phone,
            Address     :$scope.editSubAdminDetail.Address,
            Mobile      :$scope.editSubAdminDetail.Mobile,
            shopName    :$scope.editSubAdminDetail.shopName,
            shopaddress :$scope.editSubAdminDetail.shopaddress,
            userID      : localStorageService.get("user").id
          };
                      
          adminResource.updatesubAdmin($scope.editSubAdminDetail._id, data).then(function(result){
            if(result.success){
              //console.log($scope.editSubAdminDetail._id);
              deserializeData(result.editSubAdminDetail);
              //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
              $location.path('/admin/subadmin');
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
    $scope.deleteSubAdmin = function(){
      $scope.deleteAlerts =[];
      if(confirm('Are you sure?')){
        adminResource.deletesubAdmin($scope.editSubAdminDetail._id,localStorageService.get("user").id).then(function(result){
          if(result.success){
            //redirect to admin bookjobs index page
            $location.path('/admin/subadmin');
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

