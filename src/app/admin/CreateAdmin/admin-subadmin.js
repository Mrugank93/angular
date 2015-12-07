angular.module('admin.subAdmin.index', ['config','security.service', 'security.authorization', 'services.adminResource', 'services.utility','ui.bootstrap', 'directives.serverError','security', 'ui.router','ngProgress']);
angular.module('admin.subAdmin.index').config(['$routeProvider', '$urlRouterProvider', '$locationProvider', function($routeProvider, $urlRouterProvider, $locationProvider){
  //$stateProvider
    $routeProvider
    .when('/admin/subadmin', {
      templateUrl: 'admin/CreateAdmin/admin-subadmin.tpl.html',
      controller: 'SubAdminIndexCtrl',
      title: 'Sub Admin List' ,
      resolve: {
        subAdmin: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource','localStorageService', function($q, $location, $log, securityAuthorization, adminResource,localStorageService){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              //handles url with query(search) parameter
              return adminResource.findsubAdmin($location.search(),localStorageService.get('user').id);

            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/admin/bookjobs': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/admin/bookjobs';
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

angular.module('admin.subAdmin.index').controller('SubAdminIndexCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'adminResource','subAdmin','localStorageService', '$routeParams', 
  function($scope, $route, $location, $log, utility, adminResource,data,localStorageService, $routeParams ){
    //console.log(data);
    $(".color_menu ul li a").addClass("color_3");
    $(".color_menu ul li a").removeClass("color_1");
    $("#subadmin").removeClass("color_3");
    $("#subadmin").addClass("color_1");
 
    var deserializeData = function(data){      
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;     
      $scope.subadmins = data.data;   
      //console.log(data.data);
    };


    $scope.setSelected = function(subadmin) {
        $location.path('/admin/subadmin/'+subadmin._id);
    };
     var fetchProduct = function(){
      adminResource.findsubAdmin($scope.filters,localStorageService.get('user').id).then(function(data){
       deserializeData(data);

        //update url in browser addr bar
        $location.search($scope.filters);
      }, function(e){
        $log.error(e);
      });
    };

    // $scope methods
    $scope.canSave = utility.canSave;
    $scope.filtersUpdated = function(){
      //reset pagination after filter(s) is updated
      $scope.filters.page = undefined;
      fetchProduct();
    };
    $scope.prev = function(){
      $scope.filters.page = $scope.pages.prev;
      fetchProduct();
    };
    $scope.next = function(){
      $scope.filters.page = $scope.pages.next;
      fetchProduct();
    };
    
    deserializeData(data);
  }
]);