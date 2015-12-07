angular.module('account.bookjobs.editdetail', ['ngRoute', 'security.authorization', 'services.utility', 'services.accountResource', 'ui.bootstrap','security','ui.bootstrap.datetimepicker','bootstrapLightbox']);
angular.module('account.bookjobs.editdetail').config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/account/bookjobs/:id', {
      templateUrl: 'account/bookjobs/account-editbookjob.tpl.html',
      controller: 'AccountEditBookDetailCtrl',
      title: 'BookJobs / Details',
      resolve: {
        editbookjob: ['$q', '$route', '$location', 'securityAuthorization', 'accountResource','security','localStorageService', function($q, $route, $location, securityAuthorization, accountResource,security,localStorageService){
          //get app stats only for user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireVerifiedUser()
            .then(function(){
              var id = $route.current.params.id || '';
              if(id){

                return (accountResource.findBookJobs(id,localStorageService.get('user').id));
              }else{
                redirectUrl = '/account/bookjobs';
                return $q.reject();
              }              
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/account/bookjobs': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/account/bookjobs';
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      }
    });
}]);
angular.module('account.bookjobs.editdetail').filter('dateFormat', function(){
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
angular.module('account.bookjobs.editdetail').filter('timeFormat', function(){
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
angular.module('account.bookjobs.editdetail').config(function (LightboxProvider) {
  LightboxProvider.getImageUrl = function (image) {
    //console.log(image.imagesName);
    return '/images/' + image.imagesName;
  };

  LightboxProvider.getImageCaption = function (image) {
    return image.label;
  };
});
angular.module('account.bookjobs.editdetail').controller('AccountEditBookDetailCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'accountResource', 'editbookjob','localStorageService','$modal','Lightbox','$wamp',
  function($scope, $route, $location, $log, utility, accountResource, data,localStorageService,$modal,Lightbox,$wamp) {
    // local vars
    var deserializeData = function(data){
      $scope.editbookjob = data; 
     // console.log($scope.editbookjob);     
    };
    $scope.subAdmin=localStorageService.get('user').subAdmin;
  //  console.log(localStorageService.get('user'));


    //Fetch Data
    // var fetchBookjob = function(){
    //    accountResource.findBookJobs($route.current.params.id,localStorageService.get('user').id).then(function(data){
    //     deserializeData(data);

    //     //update url in browser addr bar
    //     // $location.search($scope.filters);
    //   }, function(e){
    //     $log.error(e);
    //   });
    // };

    //Subadmin
    function onNewevent(args) {
      console.log("edit mode sub admin");
      $route.reload();
       // fetchBookjob();
    }

    //User
    function onevent(args) {
       // fetchBookjob();
       console.log("edit mode users");
       $route.reload();
    }  

    //WAMP Events
    if($scope.subAdmin===true){  
      var channelassign='com.plastfix.Assignbookjob.'+localStorageService.get('user').id;
      console.log("subscribe subadmin bookjobs",channelassign);
      $wamp.subscribe(channelassign, onNewevent);
    }else{
      var channel='com.plastfix.bookjobStatus.'+localStorageService.get('user').id;
      $wamp.subscribe(channel, onevent);
      console.log("subscribe user bookjobs",channel);
    }

    $scope.openLightbox = function (index) {
      //alert($scope.editbookjob.images[index].imagesName);
      Lightbox.openModal($scope.editbookjob.images, index);
    };
    $scope.RejectPrice=function(){
      $scope.detailAlerts = [];          
       var data = {       
        Status:'PriceRejected',
        userID      : localStorageService.get("user").id
       };
        accountResource.updateBookjob($scope.editbookjob._id, data).then(function(result){
        if(result.success){
          deserializeData(result.editbookjob);
          //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
           $location.path('/account/bookjobs');
        }else{
          angular.forEach(result.errors, function(err, index){
            $scope.detailAlerts.push({ type: 'danger', msg: err });
          });
        }        
      }, function(x){
        $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating bookjobs: ' + x });
      });
    };
    $scope.acceptPrice=function(){            
          $scope.detailAlerts = [];
          var AcceptPrice={      
            Status      :'PriceAccepted',            
            userID      : localStorageService.get("user").id
          };
          //console.log(AcceptPrice,"id",args[0].bookJobId);
          accountResource.updateBookjob($scope.editbookjob._id, AcceptPrice).then(function(result){
            if(result.success){
              deserializeData(result.editbookjob);
              $location.path('/account/bookjobs');             
              //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
                            
            }else{
              angular.forEach(result.errors, function(err, index){
                $scope.detailAlerts.push({ type: 'danger', msg: err });
              });
            } 
           
          }, function(x){
            $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating bookjobs: ' + x });
          });
    };

    $scope.Accept=function(){
      $scope.detailAlerts = [];          
       var data = {       
        Status:'Accepted',
        acceptedTime:new Date(),
        userID      : localStorageService.get("user").id
       };
        accountResource.updateBookjob($scope.editbookjob._id, data).then(function(result){
        if(result.success){
          deserializeData(result.editbookjob);
          //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
           $location.path('/account/bookjobs');
        }else{
          angular.forEach(result.errors, function(err, index){
            $scope.detailAlerts.push({ type: 'danger', msg: err });
          });
        }        
      }, function(x){
        $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating bookjobs: ' + x });
      });
    };
    $scope.rateJob=function(){
         var modalInstance = $modal.open({
              templateUrl: 'account/bookjobs/rate.tpl.html',
              controller: 'ModalRateCtrl',
              resolve: {
                ratejob: ['$q', '$location', '$log', 'securityAuthorization', 'accountResource','security','localStorageService', function($q, $location, $log, securityAuthorization, accountResource,security,localStorageService){
                   //get app stats only for admin-user, otherwise redirect to /account
                  
                  //console.log("bookjobid",id);
                 // console.log($scope.editbookjob._id);
                  if($scope.editbookjob._id){
                      return (accountResource.findBookJobs($scope.editbookjob._id,localStorageService.get('user').id));
                  }else{
                    // redirectUrl = '/account/bookjobs';
                    return $q.reject();
                  }  
                }]
              },
            });      
    };
    
     $scope.jobStarted=function(){
      $scope.detailAlerts = [];          
       var data = {       
        Status:'Started',
        jobStarted : new Date(),
        userID      : localStorageService.get("user").id
       };
        accountResource.updateBookjob($scope.editbookjob._id, data).then(function(result){
        if(result.success){
          //deserializeData(result.editbookjob);
          //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
           $location.path('/account/bookjobs');
        }else{
          angular.forEach(result.errors, function(err, index){
            $scope.detailAlerts.push({ type: 'danger', msg: err });
          });
        }        
      }, function(x){
        $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating bookjobs: ' + x });
      });
    };
    
    $scope.jobFinished=function(){
      
      $scope.detailAlerts = [];
          var modalInstance = $modal.open({
              templateUrl: 'account/bookjobs/dateTime.tpl.html',
              controller: 'ModalfinishedCtrl',
              resolve: {
                editAssignjob: ['$q', '$location', '$log', 'securityAuthorization', 'accountResource','security','localStorageService', function($q, $location, $log, securityAuthorization, accountResource,security,localStorageService){
                   //get app stats only for admin-user, otherwise redirect to /account
                  //var id=args[0].bookJobId;
                  //console.log("bookjobid",id);
               // console.log($scope.editbookjob._id);
                  if($scope.editbookjob._id){
                      return (accountResource.findBookJobs($scope.editbookjob._id,localStorageService.get('user').id));
                  }else{
                    // redirectUrl = '/account/bookjobs';
                    return $q.reject();
                  }  
                }]
              },
          });
            
          //   modalInstance.result.then(function(data) {
          //     console.log(data);

          //   });       
    
    };  

    $scope.jobDelivered=function(){
      
      $scope.detailAlerts = [];         
            
       var data = {
        Status:'Delivered',
        userID      : localStorageService.get("user").id
       };
        accountResource.updateBookjob($scope.editbookjob._id, data).then(function(result){
          if(result.success){
            //deserializeData(result.editbookjob);
            //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
            $location.path('/account/bookjobs/');
            //adminResource.findBookJobs($scope.editbookjob._id,localStorageService.get("user").id);
          }else{
            angular.forEach(result.errors, function(err, index){
              $scope.detailAlerts.push({ type: 'danger', msg: err });
            });
          }        
        }, function(x){
          $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating bookjobs: ' + x });
        });
    }; 
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
    //$scope.makesDetail=data.data;
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
        accountResource.deleteBookjob($scope.editbookjob._id,localStorageService.get('user').id).then(function(result){
          if(result.success){
            //redirect to account bookjobs index page
            $location.path('/account/bookjobs');
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
angular.module('account.bookjobs.editdetail').controller('ModalfinishedCtrl', ['$scope','$modalInstance','$location','localStorageService','accountResource','editAssignjob',
  function ($scope,$modalInstance,$location,localStorageService,accountResource,data) {
   //console.log(data);
 
  
  $scope.canceldate=function(){
    //$location.path('/account/bookjobs');
    $modalInstance.dismiss();
  };
  $scope.finish=function(){
    $scope.detailAlerts = [];
      var estimateTime={  
          Status:'Finished',    
          estimatedTime : $scope.estimatedTime,
          userID        : localStorageService.get("user").id
      };
      //console.log(estimateTime);
      accountResource.updateBookjob(data._id, estimateTime).then(function(result){
        if(result.success){
          //deserializeData(result.editbookjob);
          //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
           //$("#rateform").modal('hide');

          $modalInstance.dismiss();
          $location.path('/account/bookjobs/');
          //return accountResource.findBookJobs(data._id,localStorageService.get('user').id);      
        }else{
          angular.forEach(result.errors, function(err, index){
            $scope.detailAlerts.push({ type: 'danger', msg: err });
          });
        } 
       
      }, function(x){
        $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating bookjobs: ' + x });
      });
    // $modalInstance.dismiss();
    // $location.path('/account/bookjobs');
  };
 
}]);
angular.module('account.bookjobs.editdetail').controller('ModalRateCtrl', ['$scope','$modalInstance','$location','utility','localStorageService','accountResource','ratejob',
  function ($scope,$modalInstance,$location,utility,localStorageService,accountResource,data) {
    $scope.canSave = utility.canSave;
    $scope.QualityRating = {
        current: -1,
        max: 10
    };
    $scope.DeliveryRating = {
        current: -1,
        max: 10
    };
    $scope.ServiceRating = {
        current: -1,
        max: 10
    };

    // $scope.getSelectedRating = function (rating) {
    //     //console.log(rating);
    // };
  $scope.rate=function(){
      //console.log("data",data);      
      $scope.detailAlerts = [];
      if($scope.RatingNote){
        var setRate={      
          DeliveryRating  : $scope.DeliveryRating.current,
          QualityRating   : $scope.QualityRating.current,
          ServiceRating   : $scope.ServiceRating.current,
          RatingNote      : $scope.RatingNote,   
          userID      : localStorageService.get("user").id
        };
      //console.log(setRate);
      accountResource.updateBookjob(data._id, setRate).then(function(result){
        if(result.success){
          //deserializeData(result.editbookjob);
          //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
           //$("#rateform").modal('hide');

          $modalInstance.dismiss();
          $location.path('/account/bookjobs/');
          //return accountResource.findBookJobs(data._id,localStorageService.get('user').id);      
        }else{
          angular.forEach(result.errors, function(err, index){
            $scope.detailAlerts.push({ type: 'danger', msg: err });
          });
        } 
       
      }, function(x){
        $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating bookjobs: ' + x });
      });

      }else{
        $('#RatingNote').css("background-color","#f2dede");
        $('#RatingNote').css("border-color","#ebccd1");
      }
  
    
      
  };
  $scope.cancelrate=function(){
    //$location.path('/account/bookjobs');
    $modalInstance.dismiss();
  };

 
}]);