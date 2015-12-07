angular.module('admin.subAdmin.add', ['ngRoute','config','security.service', 'security.authorization', 'services.adminResource', 'services.utility','ui.bootstrap', 'directives.serverError','ngFileUpload']);
angular.module('admin.subAdmin.add').config(['$routeProvider','securityAuthorizationProvider', function($routeProvider){
  $routeProvider
    .when('/admin/subadmin/add', {
      templateUrl: 'admin/CreateAdmin/admin-createAdmin.tpl.html',
      controller: 'AddSubAdminCtrl',
      title: 'Add Sub Admin', 
    
      reloadOnSearch: false
    });
}]);

angular.module('admin.subAdmin.add').controller('AddSubAdminCtrl', ['$scope', '$route', '$location', '$log', 'utility' ,'adminResource','localStorageService',
  function($scope, $route, $location, $log, utility,adminResource,localStorageService){
      
    $scope.add = {};
   
    // $scope methods
     $scope.canSave = utility.canSave;
      
   
    $scope.addNewAdmin=function(){
      //console.log($scope.add); 
        $scope.add.userID=localStorageService.get("user").id;
        //console.log($scope.add);
        adminResource.addsubAdmin($scope.add).then(function(data){
          $scope.add = {};  
          if(data.success){
            //console.log(data);
            $route.reload();          
            //redirect to admin index page
            $location.path('/admin/subadmin');
            //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
          }else if (data.errors && data.errors.length > 0){
            alert(data.errors[0]);
          }else {
            alert('unknown error.');
          }
        }, function(e){
          $scope.add = {};
          $log.error(e);
        });
      
    };
}]);