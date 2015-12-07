angular.module('account.bookjobs.detail', ['ngRoute','config','security.service', 'security.authorization', 'services.accountResource', 'services.utility','ui.bootstrap','ui.bootstrap.datepicker','directives.serverError','ngFileUpload']);
angular.module('account.bookjobs.detail').config(['$routeProvider','securityAuthorizationProvider', function($routeProvider){
  $routeProvider
    .when('/account/bookjobs/add', {
      templateUrl: 'account/bookjobs/account-addbookjob.tpl.html',
      controller: 'AccountAddBookJobCtrl',
      title: 'Add Job detail', 
      // resolve: {
      //     addbookjob: ['$q', '$location', '$log', 'securityAuthorization', 'accountResource','security','localStorageService', function($q, $location, $log, securityAuthorization, accountResource,security,localStorageService){
      //     // //get app st'ats only for admin-user, otherwise redirect to /account
      //     var redirectUrl;
     
      //     // console.log("test:",security.currentUser.id);
      //     var promise = securityAuthorization.requireVerifiedUser()
      //     .then(function(){
      //       return accountResource.findmakejob(localStorageService.get('user').id);
      //       },
      //       function(reason){
      //         //rejected either user is un-authorized or un-authenticated
      //         redirectUrl = reason === 'unauthorized-client'? '/account': '/login';
      //         return $q.reject();
      //       })
      //       .catch(function(){
      //         redirectUrl = redirectUrl || '/account/bookjobs';
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
angular.module('account.bookjobs.detail').filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });
      return output;
   };
});
// angular.module('account.bookjobs.detail').filter('AddTimeFormat', function(){
//     return function(date){
//         //var chTime = new Date(Date.parse(date)).toUTCString();      
//         // var date = moment.utc(date).format('YYYY-MM-DD HH:mm');
//         // return date;     


//         //var checkTime = new Date(Date.parse(date)).toUTCString();
//         // var checkType = itemCheckin.checkType;
//         var checkTimeSet = moment.utc(date).format('hh:mm'); 
//         return checkTimeSet; 
//     };
// });
// angular.module('account.bookjobs.detail').filter('AddDateFormat', function(){
//     return function(date){
//         //var chTime = new Date(Date.parse(date)).toUTCString();      
//         // var date = moment.utc(date).format('YYYY-MM-DD HH:mm');
//         // return date;     


//         //var checkTime = new Date(Date.parse(date)).toUTCString();
//         // var checkType = itemCheckin.checkType;
//         var checkTimeSet = moment.utc(date).format('MMM DD,YYYY'); 
//         return checkTimeSet; 
//     };
// });
angular.module('account.bookjobs.detail').controller('AccountAddBookJobCtrl', ['$scope', '$route', '$location', '$log', 'utility' ,'accountResource','Upload','$timeout','localStorageService',
  function($scope, $route, $location, $log, utility,accountResource,Upload,$timeout,localStorageService){
      
      $scope.add = {};
      $scope.PickupTime = new Date();
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
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();
  //$scope.maxDate = new Date(2020, 5, 22);

 
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

 
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  
  $scope.yearList =  [];

  var today = new Date();
  var year = today.getFullYear();
  // console.log(year);
  for (var i = year+1; i >= 1971; i--) {
        $scope.yearList.push({'name':i,value:i});
  }  


  // $scope.add.year=$scope.yearList[0];

  // $scope.getDayClass = function(date, mode) {
  //   if (mode === 'day') {
  //     var dayToCheck = new Date(date).setHours(0,0,0,0);

  //     for (var i=0;i<$scope.events.length;i++){
  //       var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

  //       if (dayToCheck === currentDay) {
  //         return $scope.events[i].status;
  //       }
  //     }
  //   }

  //   return '';
  // };
    // $scope methods
     $scope.canSave = utility.canSave;
     //$scope.makesDetail=datas.data;
     $scope.fileUploadsList = [];
      
    $scope.uploadFiles = function(files, errFiles) {      
      
      $scope.files = files;
      //console.log($scope.files);
      var newCounter = 0;
      
     
      $scope.errFiles = errFiles;
      $scope.fileNames=[];
        angular.forEach(files, function(file) {           
          // var today = new Date();
          // var currentDnT=today.getFullYear();
          //     currentDnT=currentDnT+today.getMonth()+1;
          //     currentDnT=currentDnT+today.getDate();
          //     currentDnT=currentDnT+today.getHours();
          //     currentDnT=currentDnT+today.getMinutes();
          //     currentDnT=currentDnT+today.getSeconds();
              
          // // currentDnT=currentDnT+'_'+localStorageService.get('user').id;
          // console.log(currentDnT);
          // file.name='changedname.png';
          file.upload = Upload.upload({
              url: '/api/uploads',            
              file : file,
          });
          file.upload.then(function (response) {
            // alert(response);
            $scope.fileUploadsList.push(file);

             //newCounter++;
             //console.log(newCounter);
            // if(newCounter === files.length) {
            //   if($scope.fileUploadsList.length>0) {
            //     $scope.fileUploadsList.push($scope.files);
            //   } else {
            //     $scope.fileUploadsList = $scope.files;
            //   }
            // }
            // console.log(response.data);
            // $scope.fileNames.push(response.data.record.images[0]);
            // console.log($scope.fileNames);
              $timeout(function () {
                  file.result = response.data;
              });
          }, function (response) {
              if (response.status > 0)
                  {$scope.errorMsg = response.status + ': ' + response.data;}
          }, function (evt) {
              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });
      });
    };
    

    $scope.addBookJob = function(){       
      // console.log($scope.fileUploadsList);
      // console.log($scope.add.fileArray);
      var fileLists = [];
      // $scope.add.fileArray = $scope.fileUploadsList;
      for (var i = 0; i < $scope.fileUploadsList.length; i++) {
        // console.log($scope.fileUploadsList[i].name);
        fileLists.push({imagesName:$scope.fileUploadsList[i].name,Comments:$scope.fileUploadsList[i].imgComment});
      }       
      $scope.add.fileArray=fileLists;
      //console.log($scope.add.fileArray.length);&& 
      $scope.add.userID=localStorageService.get("user").id;
      if($scope.add.fileArray.length>=1){
        if($scope.add.fileArray.length<=3){
        accountResource.addBookjob($scope.add).then(function(data){
          //console.log(data);
          $scope.add = {};
          $scope.fileUploadsList =[];   

          if(data.success){

            $route.reload();          
            //redirect to account bookjob index page
            $location.path('/account/bookjobs');
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
         $scope.msg="You Can't upload images more than three";
      }
      }else{      
        $scope.msg="Please Select Atleast one image";       
      }
    };


    $scope.deleteFilesFromTheArray = function(fileName) {      
      for (var i = 0; i < $scope.fileUploadsList.length; i++) {
        if($scope.fileUploadsList[i].name === fileName.name ) {
          $scope.fileUploadsList.splice(i,1);

        }
      }
      
    };

  }
]);