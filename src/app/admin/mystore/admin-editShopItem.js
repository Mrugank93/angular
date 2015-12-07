angular.module('admin.mystore.editdetail', ['ngRoute', 'security.authorization', 'services.utility', 'services.adminResource', 'ui.bootstrap']);
angular.module('admin.mystore.editdetail').config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/admin/mystore/:id', {
      templateUrl: 'admin/mystore/admin-editShopItem.tpl.html',
      controller: 'AdminEditShopDetailCtrl',
      title: 'Item / Details',
      resolve: {
        editItemDetail: ['$q', '$route', '$location', 'securityAuthorization', 'adminResource','localStorageService', function($q, $route, $location, securityAuthorization, adminResource,localStorageService){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              var id = $route.current.params.id || '';
              // var uid =localStorageService.get("user").id;
              if(id){
                return adminResource.readProduct(id,localStorageService.get("user").id);
              }else{
                redirectUrl = '/admin/mystore';
                return $q.reject();
              }
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/admin': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/admin/mystore';
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      }
    });
}]);
angular.module('admin.mystore.editdetail').controller('AdminEditShopDetailCtrl', ['$routeParams','$scope', '$route', '$location', '$log', 'utility','Upload','$timeout','adminResource', 'editItemDetail','localStorageService','$modal',
  function($routeParams,$scope, $route, $location, $log, utility,Upload,$timeout, adminResource, data, localStorageService,$modal) {
    // local vars
    
    var deserializeData = function(data){
      $scope.editItemDetail = data;      
      //console.log($scope.editItemDetail);
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
            //console.log(response);
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
    };
    $scope.editProduct=function(){
      $scope.detailAlerts = [];
      var StoreImage = []; 
      //console.log("imagelength",$scope.fileUpload.length);
      if($scope.editItemDetail.productName){
        $('#productName').css("background-color","");
        $('#productName').css("border-color","");
        if($scope.editItemDetail.reference){
          $('#reference').css("background-color","");
          $('#reference').css("border-color","");
            if($scope.editItemDetail.price){
              $('#price').css("background-color","");
              $('#price').css("border-color","");
              if($scope.editItemDetail.category){
                  if($scope.fileUpload.length===1){
                      StoreImage.push($scope.fileUpload[0].name); 
                      $scope.editItemDetail.itemImage=StoreImage;
                      //console.log("imagename",$scope.editItemDetail.itemImage[0]);
                      $scope.prodImage=$scope.editItemDetail.itemImage[0];
                      //console.log("image",$scope.prodImage);
                    } 
                    else
                    {
                      $scope.prodImage=$scope.editItemDetail.itemImage;
                      //console.log($scope.prodImage);
                    }
                   
                    var data={
                      productName:$scope.editItemDetail.productName,
                      reference  :$scope.editItemDetail.reference,
                      price      :$scope.editItemDetail.price,
                      category   :$scope.editItemDetail.category,
                      itemImage  :$scope.prodImage,
                      userID     : localStorageService.get("user").id
                    };
                    //console.log("data",data);
                    
                 
                    adminResource.updateProduct($scope.editItemDetail._id, data).then(function(result){
                      if(result.success){
                        //console.log($scope.editItemDetail._id);
                        deserializeData(result.editItemDetail);
                        //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
                        $location.path('/admin/mystore');
                      }else{

                        angular.forEach(result.errors, function(err, index){
                          console.log(err);
                          $scope.detailAlerts.push({ type: 'danger', msg: err });
                        });
                      }        
                    }, function(x){
                      $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating Products: ' + x });
                  });
              }else{
                  $scope.msg="Please Select Category";
              }
            }else{
              $('#price').css("background-color","#f2dede");
              $('#price').css("border-color","#ebccd1");
            }
        }else{          
          $('#reference').css("background-color","#f2dede");
          $('#reference').css("border-color","#ebccd1");
        }
      }else{
        $('#productName').css("background-color","#f2dede");
        $('#productName').css("border-color","#ebccd1");
      }
      // if($scope.fileUpload.length==1){
      //   StoreImage.push($scope.fileUpload[0].name); 
      //   $scope.editItemDetail.itemImage=StoreImage;
      //   //console.log("imagename",$scope.editItemDetail.itemImage[0]);
      //   $scope.prodImage=$scope.editItemDetail.itemImage[0];
      //   //console.log("image",$scope.prodImage);
      // } 
      // else
      // {
      //   $scope.prodImage=$scope.editItemDetail.itemImage;
      //   //console.log($scope.prodImage);
      // }
     
      // var data={
      //   productName:$scope.editItemDetail.productName,
      //   reference  :$scope.editItemDetail.reference,
      //   price      :$scope.editItemDetail.price,
      //   itemImage  :$scope.prodImage,
      //   userID     : localStorageService.get("user").id
      // };
      // //console.log("data",data);
      
   
      // adminResource.updateProduct($scope.editItemDetail._id, data).then(function(result){
      //   if(result.success){
      //     //console.log($scope.editItemDetail._id);
      //     deserializeData(result.editItemDetail);
      //     //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
      //     $location.path('/admin/mystore');
      //   }else{

      //     angular.forEach(result.errors, function(err, index){
      //       console.log(err);
      //       $scope.detailAlerts.push({ type: 'danger', msg: err });
      //     });
      //   }        
      // }, function(x){
      //   $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating Products: ' + x });
      // });
    };
    $scope.deleteProduct = function(){
      $scope.deleteAlerts =[];
      if(confirm('Are you sure?')){
        adminResource.deleteProduct($scope.editItemDetail._id,localStorageService.get("user").id).then(function(result){
          if(result.success){
            //redirect to admin bookjobs index page
            $location.path('/admin/mystore');
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

