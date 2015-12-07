angular.module('services.accountResource', ['security.service']).factory('accountResource', ['$http', '$q', '$log', 'security','localStorageService', function ($http, $q, $log, security,localStorageService) {
  // local variable
  var baseUrl = '/api';
  var processResponse = function(res){    
    return res.data;
  };
  var processError = function(e){
    var msg = [];
    if(e.status)         { msg.push(e.status); }
    if(e.statusText)     { msg.push(e.statusText); }
    if(msg.length === 0) { msg.push('Unknown Server Error'); }
    return $q.reject(msg.join(' '));
  };
  // public api
  var resource = {};
  resource.sendMessage = function(data){
    return $http.post(baseUrl + '/sendMessage', data).then(processResponse, processError);
  };

  resource.getAccountDetails = function(){
    return $http.get(baseUrl + '/account/settings').then(processResponse, processError);
  };
  resource.setAccountDetails = function(data){
    return $http.put(baseUrl + '/account/settings', data).then(processResponse, processError);
  };
  resource.setIdentity = function(data){
    return $http.put(baseUrl + '/account/settings/identity', data).then(processResponse, processError);
  };
  resource.setPassword = function(data){
    return $http.put(baseUrl + '/account/settings/password', data).then(processResponse, processError);
  };

  resource.resendVerification = function(email){
    return $http.post(baseUrl + '/account/verification', {email: email}).then(processResponse, processError);
  };

  resource.upsertVerification = function(){
    return $http.get(baseUrl + '/account/verification').then(processResponse, processError);
  };

  resource.verifyAccount = function(token){
    return $http.get(baseUrl + '/account/verification/' + token)
      .then(processResponse, processError)
      .then(function(data){
        //this saves us another round trip to backend to retrieve the latest currentUser obj
        if(data.success && data.user){
          security.setCurrentUser(data.user);
        }
        return data;
      });
  };
   
  resource.findBookjob = function(pageNo,id,uid){
    //console.log("data................"+data);
    // alert(JSON.stringify(data));
    // alert(JSON.stringify(baseUrl+'/account/bookjobs'));
   // localStorageService.get('user').subAdmin
   // console.log(pageNo,id,uid);
   var subAdmin = false;
   if(localStorageService.get('user').subAdmin) {
    subAdmin=localStorageService.get('user').subAdmin;
   }
   // console.log("account side",pageNo,id,uid);
   // alert(localStorageService.get('user').subAdmin);
   return $http.post(baseUrl+'/account/bookjobsFind', {subAdmin:subAdmin,pageNo:pageNo,id:id,userID:uid}).then(processResponse, processError);
  };

  resource.findmakejob = function(data){
    //console.log("data................"+data);
    // alert(JSON.stringify(data));
   var url = baseUrl + '/account/bookjobs' + '/' +data;
   return $http.get(url).then(processResponse, processError);
  };

  resource.addBookjob = function(data){
      // console.log(data);       
    //alert(JSON.stringify(data));
    
    return $http.post(baseUrl + '/account/bookjobs', data).then(processResponse, processError);
  };
  // resource.addjobUpload = function(data){
  //     console.log(data);       
  //   //alert(JSON.stringify(data));
  //   return $http.post(baseUrl + '/account/bookjobs/upload', {files:data}).then(processResponse, processError);
  // };
  resource.findBookJobs = function(_id,data){
    var url = baseUrl + '/account/bookjobs' + '/' + _id+'/'+data;
    return $http.get(url).then(processResponse, processError);
  };
  resource.updateBookjob = function(_id, data){
    var url = baseUrl + '/account/bookjobs' + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.deleteBookjob = function(_id,uid){
    var url = baseUrl + '/account/bookjobs' + '/' + _id+'/'+uid;
    return $http.delete(url).then(processResponse, processError);
  };

   // Product Api 
  resource.findProduct = function(filters,id){
    //console.log("data................"+data);
    if(angular.equals({}, filters)){
      filters = undefined;
    }    
   return $http.get(baseUrl+'/account/products'+'/'+id, {params:filters}).then(processResponse, processError);
  };
  // resource.addProduct = function(data){
  //    //console.log(data);
  //   return $http.post(baseUrl+'/admin/addProduct', data).then(processResponse, processError);
  // };
  resource.readProduct = function(_id,uid){
     //console.log(data);
    return $http.get(baseUrl+'/account/editproducts'+ '/' + _id + '/' +uid).then(processResponse, processError);
  };
  return resource;
}]);
