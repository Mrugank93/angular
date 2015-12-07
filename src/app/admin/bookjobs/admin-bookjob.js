angular.module('admin.bookjobs.index', ['ngRoute', 'security.authorization', 'services.utility', 'services.adminResource','tableSort','flash','ngAnimate']);
angular.module('admin.bookjobs.index').config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/admin/bookjobs', {
      templateUrl: 'admin/bookjobs/admin-bookjob.tpl.html',
      controller: 'BookJobIndexCtrl',
      title: 'Manage Jobs',
      resolve: {
        bookjob: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource','localStorageService', function($q, $location, $log, securityAuthorization, adminResource,localStorageService){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              //handles url with query(search) parameter
              return adminResource.findBookjob($location.search(),localStorageService.get('user').id);

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
      reloadOnSearch: false
    });
}]);
angular.module('admin.bookjobs.index').filter('dateFormats', function(){
    return function(date){
        //var chTime = new Date(Date.parse(date)).toUTCString();      
        // var date = moment.utc(date).format('YYYY-MM-DD HH:mm');
        // return date;     


        //var checkTime = new Date(Date.parse(date)).toUTCString();
        // var checkType = itemCheckin.checkType;
        var checkTimeSet = moment.utc(date).format('MMM DD,YYYY hh:mm'); 
        return checkTimeSet; 
    };
});
angular.module('admin.bookjobs.index').controller('BookJobIndexCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'adminResource','Flash','$wamp','bookjob','localStorageService',
  function($scope, $route, $location, $log, utility, adminResource,Flash,$wamp,data,localStorageService){
    
    $(".color_menu ul li a").addClass("color_3");
    $(".color_menu ul li a").removeClass("color_1");
    $("#bookjobs").removeClass("color_3");
    $("#bookjobs").addClass("color_1");
    //()
    var deserializeData = function(data){  
    
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;     
      $scope.Jobs = data.data;   
       // console.log($scope.filters);
    };

    $scope.set_color = function (job) {
        if (job.Status === 'Accept') {
         return { 'background-color': "green","color":"#ffffff"};
        }else if (job.Status === 'PriceAccepted'){
          return { 'background-color': "orange","color":"#ffffff"};
        }else if (job.Status === 'Allocated'){  
          return { 'background-color': "blue","color":"#ffffff" };
        }else if(job.Status === 'Declined'){
          return { 'background-color': "red","color":"#ffffff" };
        }else if(job.Status === 'PriceSent'){
          return { 'background-color': "yellow" };
        }else if(job.Status === 'Delivered'){
          return { 'background-color': "blue","color":"#ffffff" };
        }else if(job.Status === 'Started'){
          return { 'background-color': "lightblue","color":"#ffffff" };
        }else if(job.Status === 'Finished'){
          return { 'background-color': "lightgreen","color":"#ffffff"};
        }else if (job.Status === 'Accepted'){
          return { 'background-color': "orange","color":"#ffffff"};
        }else if(job.Status === 'Rated'){
          return { 'background-color': "green","color":"#ffffff" };
        }
    };
    $scope.checkRead = function (jobs) {
     if(jobs){ 
      // console.log(jobs);
      if (jobs.jobStatus === 'unread') {
         return { 'font-weight':'bold' };
      }else{
          return { 'font-weight':'regular' };
      }
     } 
    };
  
    $scope.setSelected = function(job) {     
      $location.path('/admin/bookjobs/'+job._id);    
    };

    var fetchBookjob = function(){
      adminResource.findBookjob($scope.filters,localStorageService.get('user').id).then(function(data){
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
        console.log($scope.filters);
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
    function onevent(args) {
       var msg = args[0].flashMessage,
           bookJobId=args[0].bookJobId,
           type = args[0].Status,
           message = args[0].flashMessage+"<a class='left-space' href='/admin/bookjobs/"+bookJobId+"'><button class='btn btn-primary' close-flash=''>open job</button></a>";
       
      // console.log("admin",type);     

      if(type==='PriceAccepted' || type==='Accepted' || type==='Started'  || type==='Delivered' || type==='Finished'){

        Flash.create('success', msg);
        Flash.pause(); 

      //->SubAdmin Finished the job    
      }else if(type==='Rated' || type==='Created'){  
        Flash.create('success', message);
        Flash.pause(); 
      //->Admin Declined the job  
      }else{
        console.log("update data");
      }       

      fetchBookjob();


      //  if(args[0].flashMessage.indexOf('Accepted')===-1 && args[0].flashMessage.indexOf('Rejected')===-1 && args[0].flashMessage.indexOf('Started')===-1 && args[0].flashMessage.indexOf('updateData')===-1){
         
      //    adminResource.findBookjob($scope.filters,localStorageService.get('user').id).then(function(data){
      //     deserializeData(data);

      //     //update url in browser addr bar
      //       $location.search($scope.filters);
      //     }, function(e){
      //       $log.error(e);
      //     });
      //     Flash.create('success', message);
      //     Flash.pause();        
      //  }else if(args[0].flashMessage.indexOf('Rejected')===-1 && args[0].flashMessage.indexOf('Started')===-1 && args[0].flashMessage.indexOf('updateData')===-1){
                 
      //     adminResource.findBookjob($scope.filters,localStorageService.get('user').id).then(function(data){
      //     deserializeData(data);

      //     //update url in browser addr bar
      //       $location.search($scope.filters);
      //     }, function(e){
      //       $log.error(e);
      //     });
      //     Flash.create('success', msg); 
      //     Flash.pause(); 
      // }else if(args[0].flashMessage.indexOf('Rejected')===-1 && args[0].flashMessage.indexOf('updateData')===-1){
                 
      //     adminResource.findBookjob($scope.filters,localStorageService.get('user').id).then(function(data){
      //     deserializeData(data);

      //     //update url in browser addr bar
      //       $location.search($scope.filters);
      //     }, function(e){
      //       $log.error(e);
      //     });
      //     Flash.create('success', msg); 
      //     Flash.pause(); 

      // }else if(args[0].flashMessage.indexOf('Rejected')===-1){
             
      //     adminResource.findBookjob($scope.filters,localStorageService.get('user').id).then(function(data){
      //     deserializeData(data);

      //     //update url in browser addr bar
      //       $location.search($scope.filters);
      //     }, function(e){
      //       $log.error(e);
      //     });
         
      // }else{
      //     Flash.create('danger', msg); 
      //     Flash.pause();    
      //     adminResource.findBookjob($scope.filters,localStorageService.get('user').id).then(function(data){
      //     deserializeData(data);

      //     //update url in browser addr bar
      //       $location.search($scope.filters);
      //     }, function(e){
      //       $log.error(e);
      //     });
          
      // }
    }
    var channel='com.plastfix.bookjob';
    console.log("subscribe admin bookjobs",channel);
    $wamp.subscribe(channel, onevent);
    // $wamp.subscribe('com.plastfix.bookjob', onevent);
  }
]);