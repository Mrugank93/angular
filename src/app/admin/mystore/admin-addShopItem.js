angular.module('admin.mystore.add', ['ngRoute','config','security.service', 'security.authorization', 'services.adminResource', 'services.utility','ui.bootstrap', 'directives.serverError','ngFileUpload']);
angular.module('admin.mystore.add').config(['$routeProvider','securityAuthorizationProvider', function($routeProvider){
  $routeProvider
    .when('/admin/mystore/add', {
      templateUrl: 'admin/mystore/admin-addShopItem.tpl.html',
      controller: 'AddItemShopCtrl',
      title: 'Add Shop Item', 
      // resolve: {
      //     addproduct: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource','security','localStorageService', function($q, $location, $log, securityAuthorization, adminResource,security,localStorageService){
      //     // //get app st'ats only for admin-user, otherwise redirect to /admin
      //     var redirectUrl;
     
      //     // console.log("test:",security.currentUser.id);
      //     var promise = securityAuthorization.requireVerifiedUser()
      //     .then(function(){
      //       return adminResource.findmakejob(localStorageService.get('user').id);
      //       },
      //       function(reason){
      //         //rejected either user is un-authorized or un-authenticated
      //         redirectUrl = reason === 'unauthorized-client'? '/admin': '/login';
      //         return $q.reject();
      //       })
      //       .catch(function(){
      //         redirectUrl = redirectUrl || '/admin/bookjobs';
      //         $location.search({});
      //         $location.path(redirectUrl);
      //         return $q.reject();
      //       });
      //       //console.log(promise);
      //     return promise;               
         
      //   }]
      //  },
      reloadOnSearch: false
    });
}]);

angular.module('admin.mystore.add').controller('AddItemShopCtrl', ['$scope', '$route', '$location', '$log', 'utility' ,'adminResource','Upload','$timeout','localStorageService','DataService',
  function($scope, $route, $location, $log, utility,adminResource,Upload,$timeout,localStorageService,DataService){
      
    $scope.add = {};
    //$scope.store = DataService.store;
    //console.log($scope.store);

    // $scope methods
     $scope.canSave = utility.canSave;
    
     $scope.fileUpload = [];
      
     $scope.uploadFiles = function(file, errFiles) {      
      
      // $scope.files = file;
      // console.log($scope.files);
      var newCounter = 0;
      
     
      $scope.errFiles = errFiles;
      $scope.fileNames={};
       
          file.upload = Upload.upload({
              url: '/api/shop/uploads',            
              file : file,
          });
          file.upload.then(function (response) {
            //alert(JSON.stringify(response));
            $scope.fileUpload.push(file);
              $timeout(function () {
                  file.result = response.data;
              });
          }, function (response) {
              if (response.status > 0)
                  {$scope.errorMsg = response.status + ': ' + response.data;}
          }, function (evt) {
              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });
      //});
    };
   
    $scope.addProduct=function(){
      //console.log($scope.add);   
      
      //console.log("length",this.fileUpload.length);
   
        //console.log($scope.fileUpload[0].name);
       
      var StoreImage = [];  
      if($scope.fileUpload.length===1){
        StoreImage.push($scope.fileUpload[0].name); 
        $scope.add.itemImage=StoreImage;
        //console.log($scope.add.itemImage);
        $scope.add.userID=localStorageService.get("user").id;
        adminResource.addProduct($scope.add).then(function(data){
          $scope.add = {};
          $scope.fileUpload =[];   

          if(data.success){

            $route.reload();          
            //redirect to admin bookjob index page
            $location.path('/admin/mystore');
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
      }else{
        $scope.imgSelect="Please Select Product Image";
      }
        
      
    };
    // $scope.deleteFilesFromTheArray = function(fileName) {      
    //   for (var i = 0; i < $scope.fileUpload.length; i++) {
    //     if($scope.fileUpload[i].name === fileName.name ) {
    //       $scope.fileUpload.splice(i,1);

    //     }
    //   }
      
    // };

  }
]);