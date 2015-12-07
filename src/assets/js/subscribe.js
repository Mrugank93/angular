  function onevent(args) {
                
                var message = args[0].flashMessage;
                var bookJobId=args[0].bookJobId;
                //var Pricemsg = args[0].flashMessage+"  <button class='btn btn-primary' ng-click='AcceptPrice()'>Accept Price</button>";
               // var messages = args[0].flashMessage+"  <button class='btn btn-primary' ng-click='acceptPrice()'>Accept Price</button>";
                //var msg = args[0]+" <button class='btn btn-default' ng-click='open();'>Rate it</button>";
                var msg = args[0].flashMessage+"  <button class='btn btn-primary' ng-click='open()' close-flash=''>Rate Now</button>";
                $scope.open = function () {   
                    var modalInstance = $modal.open({
                      templateUrl: 'account/bookjobs/rate.tpl.html',
                      controller: 'ModalInstanceCtrl',
                      resolve: {
                        ratejob: ['$q', '$location', '$log', 'securityAuthorization', 'accountResource','security','localStorageService', function($q, $location, $log, securityAuthorization, accountResource,security,localStorageService){
                           //get app stats only for admin-user, otherwise redirect to /account
                          var id=args[0].bookJobId;
                          //console.log("bookjobid",id);
                          
                          if(id){
                              return (accountResource.findBookJobs(id,localStorageService.get('user').id));
                          }else{
                            // redirectUrl = '/account/bookjobs';
                            return $q.reject();
                          }  
                        }]
                      },
                    });
                    
                    modalInstance.result.then(function(data) {
                      console.log(data);

                    }); 

                };     
                if(args[0].flashMessage.indexOf('price')===-1 && args[0].flashMessage.indexOf('Accepted')===-1 && args[0].flashMessage.indexOf('Delivered')===-1 && args[0].flashMessage.indexOf('Estimated')===-1 && args[0].flashMessage.indexOf('Started')===-1) {
                  Flash.create('danger', message);
                  Flash.pause(); 
                  accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
                    //deserializeData(data);

                    //update url in browser addr bar
                    $location.search($scope.filters);
                  }, function(e){
                    $log.error(e);
                  });


                } else if(args[0].flashMessage.indexOf('Accepted')===-1 && args[0].flashMessage.indexOf('price')===-1 && args[0].flashMessage.indexOf('Estimated')===-1 && args[0].flashMessage.indexOf('Started')===-1){
                  Flash.create('success', msg);
                  Flash.pause(); 
                  accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
              
                    //deserializeData(data);

                    //update url in browser addr bar
                    $location.search($scope.filters);
                  }, function(e){
                    $log.error(e);
                  });    
                }else if(args[0].flashMessage.indexOf('price')===-1 && args[0].flashMessage.indexOf('Estimated')===-1 && args[0].flashMessage.indexOf('Started')===-1){
                  Flash.create('success', message);
                  Flash.pause(); 
                  accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
              
                    //deserializeData(data);

                    //update url in browser addr bar
                    $location.search($scope.filters);
                  }, function(e){
                    $log.error(e);
                  });    
                }else if(args[0].flashMessage.indexOf('price')===-1 && args[0].flashMessage.indexOf('Started')===-1){
                  Flash.create('success', message);
                  Flash.pause(); 
                  accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
              
                    //deserializeData(data);

                    //update url in browser addr bar
                    $location.search($scope.filters);
                  }, function(e){
                    $log.error(e);
                  });    
                }else if(args[0].flashMessage.indexOf('price')===-1){
                  Flash.create('success', message);
                  Flash.pause(); 
                  accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
              
                    //deserializeData(data);

                    //update url in browser addr bar
                    $location.search($scope.filters);
                  }, function(e){
                    $log.error(e);
                  });    
                }else{
                  Flash.create('success', message);
                  Flash.pause(); 
                  accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
                   //deserializeData(data);

                    //update url in browser addr bar
                    $location.search($scope.filters);
                  }, function(e){
                    $log.error(e);
                  });

                }
            }
            function onNewevent(args) {  
                $scope.bid=args[0].bookJobId;  
                $scope.assignAdmin=args[0].assignAdmin;
                //console.log($scope.assignAdmin);
                var message = args[0].flashMessage+"<a href='/account/bookjobs/"+$scope.bid+"'><button class='btn btn-primary' close-flash=''>New Job</button></a>";
                
                  Flash.create('success', message);
                  Flash.pause(); 
                  //console.log("jobid",$scope.bid); 
                  // console.log("jobid",$scope.Jobs._id); 
                  accountResource.findBookjob($scope.filters.page,$scope.filters,localStorageService.get('user').id).then(function(data){
                      //assignJobData(data);
                      //deserializeData(data);
                    //update url in browser addr bar
                    $location.search($scope.filters);
                  }, function(e){
                    $log.error(e);
                  });
            }