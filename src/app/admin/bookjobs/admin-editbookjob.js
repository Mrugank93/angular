angular.module('admin.bookjobs.editdetail', ['ngRoute', 'security.authorization', 'services.utility', 'services.adminResource', 'ui.bootstrap','bootstrapLightbox']);
angular.module('admin.bookjobs.editdetail').config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/admin/bookjobs/:id', {
      templateUrl: 'admin/bookjobs/admin-editbookjob.tpl.html',
      controller: 'AdminEditBookDetailCtrl',
      title: 'BookJobs / Details',
      resolve: {
        editbookjob: ['$q', '$route', '$location', 'securityAuthorization', 'adminResource','localStorageService', function($q, $route, $location, securityAuthorization, adminResource,localStorageService){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              var id = $route.current.params.id || '';
              // var uid =localStorageService.get("user").id;
              if(id){
                return adminResource.findBookJobs(id,localStorageService.get("user").id);
              }else{
                redirectUrl = '/admin/bookjobs';
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
angular.module('admin.bookjobs.editdetail').filter('dateFormat', function(){
    return function(date){
        //var chTime = new Date(Date.parse(date)).toUTCString();      
        // var date = moment.utc(date).format('YYYY-MM-DD HH:mm');
        // return date;     


        //var checkTime = new Date(Date.parse(date)).toUTCString();
        // var checkType = itemCheckin.checkType;
        var checkTimeSet = moment.utc(date).format('MMM DD,YYYY'); 
        return checkTimeSet; 
    };
});
angular.module('admin.bookjobs.editdetail').filter('timeFormat', function(){
    return function(date){
        //var chTime = new Date(Date.parse(date)).toUTCString();      
        // var date = moment.utc(date).format('YYYY-MM-DD HH:mm');
        // return date;     


        //var checkTime = new Date(Date.parse(date)).toUTCString();
        // var checkType = itemCheckin.checkType;
        var checkTimeSet = moment.utc(date).format('hh:mm'); 
        return checkTimeSet; 
    };
});
angular.module('admin.bookjobs.editdetail').config(function (LightboxProvider) {
  LightboxProvider.getImageUrl = function (image) {
    //console.log(image.imagesName);
    return '/images/' + image.imagesName;
  };

  LightboxProvider.getImageCaption = function (image) {
    return image.label;
  };
});
angular.module('admin.bookjobs.editdetail').controller('AdminEditBookDetailCtrl', ['$routeParams','$scope', '$route', '$location', '$log', 'utility', 'adminResource', 'editbookjob','localStorageService','$modal','Lightbox','$wamp',
  function($routeParams,$scope, $route, $location, $log, utility, adminResource, data, localStorageService,$modal,Lightbox,$wamp) {
    // local vars

    if(data.jobStatus!=="read") {
      data.jobStatus="read";
      var datas = {           
        jobStatus   : 'read',
        userID      : localStorageService.get("user").id
       };       
       adminResource.updateBookjob($routeParams.id, datas).then(function(result){
          
        }, function(x){
          console.log("Error updating bookjobs:",x);
        //$scope.detailAlerts.push({ type: 'danger', msg: 'Error updating bookjobs: ' + x });
      });
    }
    var deserializeData = function(data){
      $scope.editbookjob = data;   
      $scope.assignToId = data.assignTo;
    };

    // var fetchBookjob = function(){
    //    adminResource.findBookJobs($routeParams.id,localStorageService.get("user").id).then(function(data){
    //     deserializeData(data);

    //     //update url in browser addr bar
    //     // $location.search($scope.filters);
    //   }, function(e){
    //     $log.error(e);
    //   });
    // };


    function onevent(args) {
      console.log("edit mode");
      $route.reload();
      // fetchBookjob();
    }

    var channel='com.plastfix.bookjob';
    console.log("subscribe admin bookjobs",channel);
    $wamp.subscribe(channel, onevent);

    $scope.openLightbox = function (index) {
      //alert($scope.editbookjob.images[index].imagesName);
      Lightbox.openModal($scope.editbookjob.images, index);
    };
    var fetchsubAdmin = function(){
      adminResource.findsubAdmin($scope.filters,localStorageService.get('user').id).then(function(data){
        //deserializeData(data);
        //update url in browser addr bar       
        $scope.subAdminDetail=data.data;
         //console.log($scope.subAdminDetail);
        //$location.search($scope.filters);
      }, function(e){
        $log.error(e);
      });
    };
    fetchsubAdmin();
    $scope.assignsubAdmin=function(){
       $scope.assignToId =$scope.editbookjob.assignTo;
      //console.log($scope.editbookjob.assignTo);
      $scope.errors="";
      $scope.detailAlerts = [];
      //console.log($scope.editbookjob);
      if($scope.editbookjob.assignTo){
        $('#assignTo').css("background-color","");
        $('#assignTo').css("border-color","");        
        var data = {  
          Status      : 'Allocated',
          assignTo    : $scope.editbookjob.assignTo,      
          userID      : localStorageService.get("user").id
        };      
        //console.log(data);
        adminResource.updateBookjob($scope.editbookjob._id, data).then(function(result){
        if(result.success){
          //deserializeData(result.editbookjob);

          //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
          $location.path('/admin/bookjobs');
        }else{
          angular.forEach(result.errors, function(err, index){
            $scope.detailAlerts.push({ type: 'danger', msg: err });
          });
        }        
        }, function(x){
          $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating bookjobs: ' + x });
        });

      }else{
        
          //$scope.errors="Enter Your Price";
          $('#assignTo').css("background-color","#f2dede");
          $('#assignTo').css("border-color","#ebccd1");
          //alert("err"+$scope.errors);
      }
       
    };
    $scope.Accept=function(){
      $scope.errors="";
      $scope.detailAlerts = [];
      //console.log($scope.editbookjob);
      if($scope.editbookjob.price){
        $('#price').css("background-color","");
          $('#price').css("border-color","");
        if($scope.editbookjob.freightCost){       
          $('#freightCost').css("background-color","");
          $('#freightCost').css("border-color","");
          var data = {       
            Status      :'PriceSent',
            price       : $scope.editbookjob.price,      
            freightCost : $scope.editbookjob.freightCost,
            userID      : localStorageService.get("user").id
          };      
          //console.log(data);
          adminResource.updateBookjob($scope.editbookjob._id, data).then(function(result){
          if(result.success){
            //deserializeData(result.editbookjob);

            //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
            $location.path('/admin/bookjobs');
          }else{
            angular.forEach(result.errors, function(err, index){
              $scope.detailAlerts.push({ type: 'danger', msg: err });
            });
          }        
          }, function(x){
            $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating bookjobs: ' + x });
          });
        }else{
          $('#freightCost').css("background-color","#f2dede");
          $('#freightCost').css("border-color","#ebccd1");
        }
      }else{
        
          //$scope.errors="Enter Your Price";
          $('#price').css("background-color","#f2dede");
          $('#price').css("border-color","#ebccd1");
          //alert("err"+$scope.errors);
      }
       
    };

    $scope.JobDecline=function(){
      $scope.detailAlerts = [];   
      if($scope.editbookjob.reasonDeclined){ 
        $('#reasonDeclined').css("background-color","");
        $('#reasonDeclined').css("border-color","");      
       var JobDeclined = {       
        Status        :'Declined',
        reasonDeclined:$scope.editbookjob.reasonDeclined,
        userID        : localStorageService.get("user").id
       };
       //console.log(JobDeclined);
      adminResource.updateBookjob($scope.editbookjob._id, JobDeclined).then(function(result){
        if(result.success){
         
          //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
           $location.path('/admin/bookjobs');
        }else{
          angular.forEach(result.errors, function(err, index){
            $scope.detailAlerts.push({ type: 'danger', msg: err });
          });
        }        
      }, function(x){
        $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating bookjobs: ' + x });
      });
      }else{
        $('#reasonDeclined').css("background-color","#f2dede");
        $('#reasonDeclined').css("border-color","#ebccd1");
      }
    };
      //$scope.PickupTime = new Date();

    
    // $scope.jobFinished=function(){
      
    //   $scope.detailAlerts = [];
    //   var modalInstance = $modal.open({
    //           templateUrl: 'admin/bookjobs/dateTime.tpl.html',
    //           controller: 'ModalfinishedCtrl',
    //           resolve: {
    //              editjob: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource','security','localStorageService', function($q, $location, $log, securityAuthorization, adminResource,security,localStorageService){
    //           //      //get app stats only for admin-user, otherwise redirect to /account
    //           //     var id=args[0].bookJobId;
    //           //     console.log("bookjobid",id);
                
    //           //     if(id){
    //                   return adminResource.findBookJobs($scope.editbookjob._id,localStorageService.get("user").id);
    //           //     }else{
    //           //       // redirectUrl = '/account/bookjobs';
    //           //       return $q.reject();
    //           //     }  
    //              }]
    //            },
    //         });
            
    //         // modalInstance.result.then(function(data) {
    //         //   console.log(data);

    //         // });       
    //    var data = {
    //     Status:'Finished',
    //     userID      : localStorageService.get("user").id
    //    };
    //     adminResource.updateBookjob($scope.editbookjob._id, data).then(function(result){
    //     if(result.success){
    //       //deserializeData(result.editbookjob);
    //       //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
    //       $location.path('/admin/bookjobs/'+$scope.editbookjob._id);
    //       //adminResource.findBookJobs($scope.editbookjob._id,localStorageService.get("user").id);
    //     }else{
    //       angular.forEach(result.errors, function(err, index){
    //         $scope.detailAlerts.push({ type: 'danger', msg: err });
    //       });
    //     }        
    //   }, function(x){
    //     $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating bookjobs: ' + x });
    //   });
    // };  

      $scope.hstep = 1;
      $scope.mstep = 1;
      

      $scope.ismeridian = false;
      
      $scope.changed = function () {
        $log.log('Time changed to: ' + $scope.PickupTime);
      };
  
      $scope.today = function() {
        $scope.pickupdate = new Date();
      };
      $scope.today();

 
  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : $scope.pickupdate;
  };
  $scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

 
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
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
    $scope.deleteBookjob = function(){
      $scope.deleteAlerts =[];
      if(confirm('Are you sure?')){
        adminResource.deleteBookjob($scope.editbookjob._id,localStorageService.get("user").id).then(function(result){
          if(result.success){
            //redirect to admin bookjobs index page
            $location.path('/admin/bookjobs');
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
// angular.module('admin.bookjobs.editdetail').controller('ModalfinishedCtrl', ['$routeParams','$modalInstance','$scope', '$route', '$location', '$log', 'utility', 'adminResource','localStorageService','editjob',
//   function($routeParams,$modalInstance,$scope, $route, $location, $log, utility, adminResource, localStorageService,data) {
//    //console.log(data);
//    $scope.cancelrate=function(){
//     //$location.path('/account/bookjobs');
//     $modalInstance.dismiss();
    
//   };
//   $scope.finish=function(){
//     $modalInstance.dismiss();
//     $location.path('/admin/bookjobs');
//   };
// }]);
