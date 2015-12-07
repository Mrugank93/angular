angular.module('account.bookjobs.index', ['ngRoute','config','security.service', 'security.authorization', 'services.accountResource', 'services.utility','ui.bootstrap', 'directives.serverError','security','tableSort','flash','ngAnimate']);
angular.module('account.bookjobs.index').config(['$routeProvider','securityAuthorizationProvider', function($routeProvider){
  $routeProvider
    .when('/account/bookjobs', {
      templateUrl: 'account/bookjobs/account-bookjob.tpl.html',
      controller: 'AccountBookJobIndexCtrl',
      title: 'Manage Jobs',
      resolve: {
        bookjob: ['$q', '$location', '$log', 'securityAuthorization', 'accountResource','security','localStorageService', function($q, $location, $log, securityAuthorization, accountResource,security,localStorageService){
          // //get app st'ats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          
          // alert(localStorageService.get('user'));
          // console.log("test:",security.currentUser.id);
          var promise = securityAuthorization.requireVerifiedUser()
          .then(function(){
            // alert(security.currentUser.id);
              if(localStorageService.get('user').id){
                  return accountResource.findBookjob(1,localStorageService.get('user').id,localStorageService.get('user').id);
              }else{
                  return accountResource.findBookjob(1,security.currentUser.id,security.currentUser.id);
              }
            },
            function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/account/bookjobs': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/account/bookjobs';
              $location.search({});
              $location.path(redirectUrl);
              return $q.reject();
            });
            //console.log(promise);
          return promise;               
         
        }]
      },
      // reloadOnSearch: false
    });
}]);
angular.module('account.bookjobs.index').filter('dateFormats', function(){
    return function(date){
        //var checkTime = new Date(Date.parse(date)).toUTCString();
        // var checkType = itemCheckin.checkType;
        var checkTimeSet = moment.utc(date).format('MMM DD,YYYY hh:mm'); 
        return checkTimeSet; 
    };
});
angular.module('account.bookjobs.index').controller('AccountBookJobIndexCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'accountResource','security','Flash','$wamp','bookjob','localStorageService','$modal',
  function($scope, $route, $location, $log, utility, accountResource,security,Flash,$wamp,data,localStorageService,$modal){
    // local var
   //var test=security.requestCurrentUser();
   // security.requestCurrentUser();
   //console.log("new:",security.currentUser.id);
   // var data={};
   
  // local var
    $(".color_menu ul li a").addClass("color_3");
    $(".color_menu ul li a").removeClass("color_1");
    $("#bookjobs").removeClass("color_3");
    $("#bookjobs").addClass("color_1");
    $scope.subAdmin=localStorageService.get('user').subAdmin;
    //$scope.uid=localStorageService.get('user').id;
    //console.log($scope.uid);
  
    var deserializeData = function(data){  
      //console.log(data);
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;
     // alert(JSON.stringify($scope.filters));
      $scope.Jobs = data.data;
      
      // console.log($scope.filters);
    };

    $scope.set_color = function (job) {
        if (job.Status === 'Accept') {
         return { 'background-color': "green","color":"#ffffff" };
        }else if(job.Status === 'Declined'){
          return { 'background-color': "red","color":"#ffffff" };
        }else if(job.Status === 'PriceSent'){
          return { 'background-color': "yellow" };
        }else if(job.Status === 'Delivered'){
          return { 'background-color': "blue","color":"#ffffff" };
        }else if (job.Status === 'PriceAccepted'){
          return { 'background-color': "orange","color":"#ffffff"};
        }else if(job.Status === 'Rated'){
          return { 'background-color': "green","color":"#ffffff" };
        }else if (job.Status === 'Allocated'){  
          return { 'background-color': "blue","color":"#ffffff" };
        }else if(job.Status === 'Started'){
          return { 'background-color': "lightblue","color":"#ffffff" };
        }else if(job.Status === 'Finished'){
          return { 'background-color': "lightgreen","color":"#ffffff"};
        }else if (job.Status === 'Accepted'){
          return { 'background-color': "orange","color":"#ffffff"};
        }
        
    };
    $scope.setSelected = function(job) {
        $location.path('/account/bookjobs/'+job._id);
    };
    var fetchBookjob = function(){
      accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
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
      // console.log($scope.filters);
      fetchBookjob();
    };
    
    $scope.prev = function(){
      $scope.filters.page = $scope.pages.prev;
      fetchBookjob();
    };

    $scope.next = function(){
      $scope.filters.page = $scope.pages.next;
      fetchBookjob();
    };
   

    // $scope vars
    //select elements and their associating options
    $scope.sorts = [
      {label: "id \u25B2", value: "_id"},
      {label: "id \u25BC", value: "-_id"},
      {label: "name \u25B2", value: "name"},
      {label: "name \u25BC", value: "-name"}
    ];
    $scope.limits = [
      {label: "10 items", value: 10},
      {label: "20 items", value: 20},
      {label: "50 items", value: 50},
      {label: "100 items", value: 100}
    ];

    //initialize $scope variables
    deserializeData(data);
    

    //User Notifications  
    function onevent(args) {
        
      var bookJobId = args[0].bookJobId,
          type = args[0].Status,
          message = args[0].flashMessage,
          msg = args[0].flashMessage+" <a class='left-space' href='/account/bookjobs/"+bookJobId+"'><button class='btn btn-primary' close-flash=''>Open Job</button></a>";

      // console.log("user",type);         
      //1. Admin Send the Price 
      //2. SubAdmin Accept the job  
      //3. SubAdmin Started the job 
      //4. SubAdmin Delivered the job    

        if(type==='PriceSent' || type==='Accepted' || type==='Started'  || type==='Finished'){

          Flash.create('success', message);
          Flash.pause(); 

      //->SubAdmin Finished the job    
        }else if(type==='Delivered' ||  type==='Rated'){  
          Flash.create('success', msg);
          Flash.pause(); 
        
      //->Admin Declined the job  
        }else if(type==='Declined'){

          Flash.create('danger', message);
          Flash.pause(); 
        
        }else if(type==='updateData'){
          console.log("update data");
        }       

        fetchBookjob();


          //var msg = args[0]+" <button class='btn btn-default' ng-click='open();'>Rate it</button>";
        //+"  <button class='btn btn-primary left-space' ng-click='open()' close-flash=''>Rate Now</button>";
        // $scope.open = function () {   
        //     var modalInstance = $modal.open({
        //       templateUrl: 'account/bookjobs/rate.tpl.html',
        //       controller: 'ModalInstanceCtrl',
        //       resolve: {
        //         ratejob: ['$q', '$location', '$log', 'securityAuthorization', 'accountResource','security','localStorageService', function($q, $location, $log, securityAuthorization, accountResource,security,localStorageService){
        //            //get app stats only for admin-user, otherwise redirect to /account
        //           var id=args[0].bookJobId;
        //           //console.log("bookjobid",id);
                  
        //           if(id){
        //               return (accountResource.findBookJobs(id,localStorageService.get('user').id));
        //           }else{
        //             // redirectUrl = '/account/bookjobs';
        //             return $q.reject();
        //           }  
        //         }]
        //       },
        //     });
            
        //     modalInstance.result.then(function(data) {
        //       console.log(data);

        //     }); 

        // };
        // args[0].bookJobId
        // $scope.AcceptPrice=function(){  
        //   //alert("test");          
        //   // $scope.detailAlerts = [];
        //   var AcceptPrice={      
        //     Status      :'PriceAccepted',
        //     userID      : localStorageService.get("user").id
        //   };
        //   //console.log(AcceptPrice);
        //   accountResource.updateBookjob(bookJobId, AcceptPrice).then(function(result){
        //     if(result.success){
        //       //deserializeData(result.editbookjob);
        //       //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
        //        //$("#rateform").modal('hide');

        //       //alert(bookJobId);      
        //       //return accountResource.findBookJobs(data._id,localStorageService.get('user').id);      
        //     }else{
        //       angular.forEach(result.errors, function(err, index){
        //         //$scope.detailAlerts.push({ type: 'danger', msg: err });
        //         console.log(err);
        //       });
        //     } 
           
        //   }, function(x){
        //     console.log('Error updating bookjobs: '+x);
        //     //$scope.detailAlerts.push({ type: 'danger', msg: 'Error updating bookjobs: ' + x });
        //   });

        //   // accountResource.updateBookjob(bookJobId, AcceptPrice).then(function(result){
        //   //   if(result.success){
        //   //      //deserializeData(result.bookjob);             
        //   //    fetchBookjob();
        //   //     //$scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
                        
        //   //   }else{
        //   //     angular.forEach(result.errors, function(err, index){
        //   //       $scope.detailAlerts.push({ type: 'danger', msg: err });
        //   //     });
        //   //   } 
           
        //   // }, function(x){
        //   //   $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating bookjobs: ' + x });
        //   // });
        // };

        // if(args[0].flashMessage.indexOf('price')===-1 && args[0].flashMessage.indexOf('Accepted')===-1 && args[0].flashMessage.indexOf('Delivered')===-1 && args[0].flashMessage.indexOf('Estimated')===-1 && args[0].flashMessage.indexOf('Started')===-1) {
        //   Flash.create('danger', message);
        //   Flash.pause(); 
        //   accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
        //     deserializeData(data);

        //     //update url in browser addr bar
        //     $location.search($scope.filters);
        //   }, function(e){
        //     $log.error(e);
        //   });


        // } else if(args[0].flashMessage.indexOf('Accepted')===-1 && args[0].flashMessage.indexOf('price')===-1 && args[0].flashMessage.indexOf('Estimated')===-1 && args[0].flashMessage.indexOf('Started')===-1){
        //   Flash.create('success', msg);
        //   Flash.pause(); 
        //   accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
      
        //     deserializeData(data);

        //     //update url in browser addr bar
        //     $location.search($scope.filters);
        //   }, function(e){
        //     $log.error(e);
        //   });    

        // }else if(args[0].flashMessage.indexOf('price')===-1 && args[0].flashMessage.indexOf('Estimated')===-1 && args[0].flashMessage.indexOf('Started')===-1){
        //   Flash.create('success', message);
        //   Flash.pause(); 
        //   accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
      
        //     deserializeData(data);

        //     //update url in browser addr bar
        //     $location.search($scope.filters);
        //   }, function(e){
        //     $log.error(e);
        //   });    
        // }else if(args[0].flashMessage.indexOf('price')===-1 && args[0].flashMessage.indexOf('Started')===-1){
        //   Flash.create('success', message);
        //   Flash.pause(); 
        //   accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
      
        //     deserializeData(data);

        //     //update url in browser addr bar
        //     $location.search($scope.filters);
        //   }, function(e){
        //     $log.error(e);
        //   });    
        // }else if(args[0].flashMessage.indexOf('price')===-1){
        //   Flash.create('success', message);
        //   Flash.pause(); 
        //   accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
      
        //     deserializeData(data);

        //     //update url in browser addr bar
        //     $location.search($scope.filters);
        //   }, function(e){
        //     $log.error(e);
        //   });    
        // }else{
        //   Flash.create('success', message);
        //   Flash.pause(); 
        //   accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
        //     deserializeData(data);

        //     //update url in browser addr bar
        //     $location.search($scope.filters);
        //   }, function(e){
        //     $log.error(e);
        //   });

        // }
    }


    //Sub Admin Notifications
    function onNewevent(args) {  
        $scope.bid=args[0].bookJobId;  
        $scope.assignAdmin=args[0].assignAdmin;
        var type = args[0].Status,
            message = args[0].flashMessage+"<a class='left-space' href='/account/bookjobs/"+$scope.bid+"' ><button class='btn btn-primary' close-flash=''>New Job</button></a>",
            msg = args[0].flashMessage+"<a class='left-space' href='/account/bookjobs/"+$scope.bid+"'><button class='btn btn-primary' close-flash=''>Open Job</button></a>";

        // console.log("sub admin",type);     

        //-> Admin assign the job to subAdmin
        if(type==='Allocated'){

          Flash.create('success', message);
          Flash.pause(); 

        }else if (type==='Rated'){

          Flash.create('success', msg);
          Flash.pause(); 

        }else if(type==='updateData'){
          
          console.log("update data");
        
        }       
        fetchBookjob();

       // if(args[0].flashMessage.indexOf('updateData')===-1){
       //    Flash.create('success', message);
       //    Flash.pause(); 
       //    //console.log("jobid",$scope.bid); 
       //    // console.log("jobid",$scope.Jobs._id); 
       //    accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
       //        //assignJobData(data);
       //        deserializeData(data);
       //      //update url in browser addr bar
       //      $location.search($scope.filters);
       //    }, function(e){
       //      $log.error(e);
       //    });
    
       // }else{

       //     accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
       //        //assignJobData(data);
       //        deserializeData(data);
       //      //update url in browser addr bar
       //      $location.search($scope.filters);
       //    }, function(e){
       //      $log.error(e);
       //    });

       // }   
    }
    
    if($scope.subAdmin===true){  
      var channelassign='com.plastfix.Assignbookjob.'+localStorageService.get('user').id;
      console.log("subscribe subadmin bookjobs",channelassign);
      $wamp.subscribe(channelassign, onNewevent);
    }else{
      var channel='com.plastfix.bookjobStatus.'+localStorageService.get('user').id;
      $wamp.subscribe(channel, onevent);
      console.log("subscribe user bookjobs",channel);
    }
    
}]);
angular.module('account.bookjobs.index').controller('ModalInstanceCtrl', ['$scope','$modalInstance','$location','localStorageService','accountResource','ratejob',
  function ($scope,$modalInstance,$location,localStorageService,accountResource,data) {
    
    $scope.QualityRating = {
        current: 1,
        max: 10
    };
    $scope.DeliveryRating = {
        current: 1,
        max: 10
    };
    $scope.ServiceRating = {
        current: 1,
        max: 10
    };

    // $scope.getSelectedRating = function (rating) {
    //     //console.log(rating);
    // };
  $scope.rate=function(){
      //console.log("data",data);      
      $scope.detailAlerts = [];
      if($scope.RatingNote){
        $('#RatingNote').css("background-color","");
        $('#RatingNote').css("border-color","");
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
          $modalInstance.dismiss();
          $location.path('/account/bookjobs/');
          // return accountResource.findBookJobs(data._id,localStorageService.get('user').id);      
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
  //deserializeData(data); 
 
}]);
angular.module('account.bookjobs.index').directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    };
});