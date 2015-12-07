angular.module('services.adminResource', []).factory('adminResource', ['$http', '$q', function ($http, $q) {
  // local variable
  var baseUrl = '/api';
  var userUrl = baseUrl + '/admin/users';
  var accountUrl = baseUrl + '/admin/accounts';
  var administratorUrl = baseUrl + '/admin/administrators';
  var adminGroupUrl = baseUrl + '/admin/admin-groups';
  var adminStatusesUrl = baseUrl + '/admin/statuses';
  var adminCategoriesUrl = baseUrl + '/admin/categories'; 
  var adminBookJobUrl = baseUrl + '/admin/bookjobs';
  var adminSubAdminUrl = baseUrl + '/admin/subadmin';
  var adminOrderUrl = baseUrl + '/admin/order';

  var processResponse = function(res){
    //console.log(res.data);    
    return res.data;
  };
  var processError = function(e){
    // console.log(e);
    var msg = [];
    if(e.status)         { msg.push(e.status); }
    if(e.statusText)     { msg.push(e.statusText); }
    if(msg.length === 0) { msg.push('Unknown Server Error'); }
    return $q.reject(msg.join(' '));
  };
  // public api
  var resource = {};
  resource.getStats = function(){
    return $http.get(baseUrl + '/admin').then(processResponse, processError);
  };
  resource.search = function(query){
    return $http.get(baseUrl + '/admin/search', { params: { q: query }} ).then(processResponse, processError);
  };

  // ----- users api -----
  resource.findUsers = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(userUrl, { params: filters }).then(processResponse, processError);
  };
  resource.addUser = function(username){
    return $http.post(userUrl, { username: username }).then(processResponse, processResponse);
  };
  resource.findUser = function(_id){
    var url = userUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };
  resource.updateUser = function(_id, data){
    var url = userUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.setPassword = function(_id, data){
    var url = userUrl + '/' + _id + '/password';
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.linkAdmin = function(_id, data){
    var url = userUrl + '/' + _id + '/role-admin';
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.unlinkAdmin = function(_id){
    var url = userUrl + '/' + _id + '/role-admin';
    return $http.delete(url).then(processResponse, processError);
  };
  resource.linkAccount = function(_id, data){
    var url = userUrl + '/' + _id + '/role-account';
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.unlinkAccount = function(_id){
    var url = userUrl + '/' + _id + '/role-account';
    return $http.delete(url).then(processResponse, processError);
  };
  resource.deleteUser = function(_id){
    var url = userUrl + '/' + _id;
    return $http.delete(url).then(processResponse, processError);
  };

  // ----- accounts api -----
  resource.findAccounts = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    // console.log(filters);
    return $http.get(accountUrl, { params: filters }).then(processResponse, processError);
  };
  resource.addAccount = function(fullname){
    return $http.post(accountUrl, { 'name.full': fullname }).then(processResponse, processResponse);
  };
  resource.findAccount = function(_id){
    var url = accountUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };
  resource.updateAccount = function(_id, data){
    var url = accountUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.linkUser = function(_id, data){
    var url = accountUrl + '/' + _id + '/user';
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.unlinkUser = function(_id){
    var url = accountUrl + '/' + _id + '/user';
    return $http.delete(url).then(processResponse, processError);
  };
  resource.newAccountNote = function(_id, data){
    var url = accountUrl + '/' + _id + '/notes';
    return $http.post(url, data).then(processResponse, processError);
  };
  resource.newAccountStatus = function(_id, data){
    var url = accountUrl + '/' + _id + '/status';
    return $http.post(url, data).then(processResponse, processError);
  };
  resource.deleteAccount = function(_id){
    var url = accountUrl + '/' + _id;
    return $http.delete(url).then(processResponse, processError);
  };

  // ----- administrators api -----
  resource.findAdministrators = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(administratorUrl, { params: filters }).then(processResponse, processError);
  };
  resource.addAdministrator = function(fullname){
    return $http.post(administratorUrl, { 'name.full': fullname }).then(processResponse, processResponse);
  };
  resource.findAdministrator = function(_id){
    var url = administratorUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };
  resource.updateAdministrator = function(_id, data){
    var url = administratorUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.adminLinkUser = function(_id, data){
    var url = administratorUrl + '/' + _id + '/user';
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.adminUnlinkUser = function(_id){
    var url = administratorUrl + '/' + _id + '/user';
    return $http.delete(url).then(processResponse, processError);
  };
  resource.saveAdminGroups = function(_id, data){
    var url = administratorUrl + '/' + _id + '/groups';
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.saveAdminPermissions = function(_id, data){
    var url = administratorUrl + '/' + _id + '/permissions';
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.deleteAdministrator = function(_id){
    var url = administratorUrl + '/' + _id;
    return $http.delete(url).then(processResponse, processError);
  };

  // ----- admin-groups api -----
  resource.findAdminGroups = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(adminGroupUrl, { params: filters }).then(processResponse, processError);
  };
  resource.addAdminGroup = function(name){
    return $http.post(adminGroupUrl, { name: name }).then(processResponse, processResponse);
  };
  resource.findAdminGroup = function(_id){
    var url = adminGroupUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };
  resource.updateAdminGroup = function(_id, data){
    var url = adminGroupUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.saveAdminGroupPermissions = function(_id, data){
    var url = adminGroupUrl + '/' + _id + '/permissions';
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.deleteAdminGroup = function(_id){
    var url = adminGroupUrl + '/' + _id;
    return $http.delete(url).then(processResponse, processError);
  };

  // // ----- statuses api -----
  // resource.findStatuses = function(filters){
  //   if(angular.equals({}, filters)){
  //     filters = undefined;
  //   }
  //   return $http.get(adminStatusesUrl, { params: filters }).then(processResponse, processError);
  // };
  // resource.addStatus = function(data){
  //   return $http.post(adminStatusesUrl, data).then(processResponse, processResponse);
  // };
  // resource.findStatus = function(_id){
  //   var url = adminStatusesUrl + '/' + _id;
  //   return $http.get(url).then(processResponse, processError);
  // };
  // resource.updateStatus = function(_id, data){
  //   var url = adminStatusesUrl + '/' + _id;
  //   return $http.put(url, data).then(processResponse, processError);
  // };
  // resource.deleteStatus = function(_id){
  //   var url = adminStatusesUrl + '/' + _id;
  //   return $http.delete(url).then(processResponse, processError);
  // };

  // ----- categories api -----
  // resource.findCategories = function(filters){
  //   if(angular.equals({}, filters)){
  //     filters = undefined;
  //   }
  //   return $http.get(adminCategoriesUrl, { params: filters }).then(processResponse, processError);
  // };
  // resource.addCategory = function(data){
  //    //console.log(data);
  //   return $http.post(adminCategoriesUrl, data).then(processResponse, processResponse);

  // };
  // resource.findCategory = function(_id){
  //   var url = adminCategoriesUrl + '/' + _id;
  //   return $http.get(url).then(processResponse, processError);
  // };
  // resource.updateCategory = function(_id, data){
  //   var url = adminCategoriesUrl + '/' + _id;
  //   return $http.put(url, data).then(processResponse, processError);
  // };
  // resource.deleteCategory = function(_id){
  //   var url = adminCategoriesUrl + '/' + _id;
  //   return $http.delete(url).then(processResponse, processError);
  // };

  // ----- Bookjob api ----- 
  resource.findBookjob = function(filters,id){   
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    // console.log(filters);
    // console.log(id);
    return $http.get(adminBookJobUrl+'/'+id, {params:filters}).then(processResponse, processError);
  };
  resource.addBookjob = function(data){
     // console.log(data);
    return $http.post(adminBookJobUrl, data).then(processResponse, processError);

  };
  resource.findBookJobs = function(_id,uid){
    var url = adminBookJobUrl + '/' + _id + '/' +uid;
    return $http.get(url).then(processResponse, processError);
  };
  resource.updateBookjob = function(_id, data){
    var url = adminBookJobUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  // resource.setReadStatus = function(_id, data){
  //   var url = adminBookJobUrl + '/read/' + _id;
  //   return $http.put(url, data).then(processResponse, processError);
  // };
  resource.deleteBookjob = function(_id,uid){
    var url = adminBookJobUrl + '/' + _id + '/' +uid;
    return $http.delete(url).then(processResponse, processError);
  };
  // Product Api adminProductUrl
  resource.findProduct = function(filters,id){
    //console.log("data................"+data);
    if(angular.equals({}, filters)){
      filters = undefined;
    }    
   return $http.get(baseUrl+'/admin/products'+'/'+id, {params:filters}).then(processResponse, processError);
  };
  resource.addProduct = function(data){
     //console.log(data);
    return $http.post(baseUrl+'/admin/addProduct', data).then(processResponse, processError);
  };
  resource.readProduct = function(_id,uid){
     //console.log(data);
    return $http.get(baseUrl+'/admin/editproducts'+ '/' + _id + '/' +uid).then(processResponse, processError);
  };
  resource.updateProduct = function(_id, data){
    //console.log(data);
    var url = baseUrl+'/admin/editproducts' + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  resource. deleteProduct = function(_id,uid){
    var url = baseUrl+'/admin/editproducts'+ '/' + _id + '/' +uid;
    return $http.delete(url).then(processResponse, processError);
  };
 
  // SubAdmin Api 
  resource.findsubAdmin = function(filters,id){
    
    if(angular.equals({}, filters)){
      filters = undefined;
    }    
   return $http.get(adminSubAdminUrl+'/'+id, {params:filters}).then(processResponse, processError);
  };
  resource.addsubAdmin = function(data){
    //console.log("add",data);
    return $http.post(adminSubAdminUrl, data).then(processResponse, processError);
  };
  resource.readsubAdmin = function(_id,uid){   
    return $http.get(adminSubAdminUrl+ '/' + _id + '/' +uid).then(processResponse, processError);
  };
  resource.updatesubAdmin = function(_id, data){
    //console.log(data);    
    return $http.put(adminSubAdminUrl+ '/edit/' + _id, data).then(processResponse, processError);
  };
  resource.deletesubAdmin = function(_id,uid){   
    return $http.delete(adminSubAdminUrl+ '/' + _id + '/' +uid).then(processResponse, processError);
  };
  
  // Order api 
  resource.findOrder = function(filters,id){
    //console.log("data................"+data);
    if(angular.equals({}, filters)){
      filters = undefined;
    }    
   return $http.get(adminOrderUrl+'/'+id, {params:filters}).then(processResponse, processError);
  };
  return resource;
}]);