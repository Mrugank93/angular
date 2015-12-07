angular.module('base',['ngRoute', 'security', 'services.utility', 'services.accountResource', 'services.adminResource', 'ui.bootstrap']);
angular.module('base').controller('HeaderCtrl', ['$scope', '$location', 'security','localStorageService',
  function ($scope, $location, security,localStorageService) {
    
    $scope.isAuthenticated = function(){
        return security.isAuthenticated();
    };   
    $scope.isAdmin = function(){

      if($location.path().indexOf('/admin') === -1 && !security.isAdmin()){
        
        if(security.isAuthenticated()===true){
           // console.log("if",security.isAdmin());
          $scope.username=localStorageService.get('user').username;
          $scope.shopname=localStorageService.get('user').shopName;
          $scope.subAdmin=localStorageService.get('user').subAdmin;
          //console.log("subAdmin:"+$scope.subAdmin);
        }      
        
        return false;
      }else{  
        // console.log("else",security.isAdmin());
        return security.isAdmin();
      }
    };  
   
    $scope.popUp=function(){
      
       var retVal = confirm("Are you sure you want to signout?");
       if( retVal === true ){     
                  
          return security.logout();
       }
       else{          
          return false;
       }     
    };
    $scope.isActive = function(viewLocation){
      // console.log(viewLocation);

      return $location.path() === viewLocation;
    };
  }
]);
angular.module('base').controller('AdminHeaderCtrl' ,['$scope','$location','security','adminResource','localStorageService',
  function($scope, $location, security,adminResource,localStorageService){
    //localStorageService.remove('user');     
    $scope.isAuthenticated = function(){  
      return security.isAuthenticated();
    };
    $scope.isAdmin = function(){
      if($location.path().indexOf('/admin') === -1 && !security.isAdmin()){
         if(security.isAuthenticated()===true){
          $scope.username=localStorageService.get('user').username;
          $scope.shopname=localStorageService.get('user').shopName;
          $scope.subAdmin=localStorageService.get('user').subAdmin;
          // console.log("check:"+localStorageService.get('user').shopName);
          }   
        // console.log("uname",$scope.uname,$scope.shopname);
        return false;
      }else{
        if(security.isAuthenticated()===true){
          $scope.username=localStorageService.get('user').username;         
          //console.log($scope.username);
        }  
        return security.isAdmin();
      }
    };  
    $scope.logout = function(){ 
      
      return security.logout();
    }; 
    $scope.isActive = function(viewLocation){
      // console.log(viewLocation);
      return $location.path() === viewLocation;
    };
    var clearSearchDropdown = function(){
      $scope.resultIsOpen = false;
      $scope.result = {};
    };
    var showSearchDropdown = function(data){
      $scope.result = data;
      $scope.resultIsOpen = true;
    };
   
    $scope.showDropdownHeader = function(header){
      var users = $scope.result.users;
      var accounts = $scope.result.accounts;
      var administrators = $scope.result.administrators;
      if(!(users && accounts && administrators)) {
        return false;
      }
      switch(header){
        case 'noDocsMatched':
          return users.length === 0 && accounts.length === 0 && administrators.length === 0;
        case 'Users':
          return users.length !== 0;
        case 'Accounts':
          return accounts.length !== 0;
        case 'Administrators':
          return administrators.length !== 0;
        default:
          return false;
      }
    };

    $scope.update = function(){
      clearSearchDropdown();
      if ($scope.query) {
        // no need to search backend if query string is empty
        adminResource.search($scope.query).then(function (data) {
          showSearchDropdown(data);
        }, function (e) {
          clearSearchDropdown();
        });
      }
    };

    $scope.closeAdminMenu = function(){
      $scope.adminMenuCollapsed = true;
    };

    $scope.toggleAdminMenu = function(){
      $scope.adminMenuCollapsed = !$scope.adminMenuCollapsed;
    };

    // set $scope vars initial value
    $scope.resultIsOpen = false;
    $scope.query = "";
    $scope.result = {};
    $scope.adminMenuCollapsed = true;
  }
]);
angular.module('base').controller('FooterCtrl', ['$scope', 'security',
  function($scope, security){
    $scope.isAuthenticated = function(){
      return security.isAuthenticated();
    };
    //$scope.isAdmin = security.isAdmin;
    $scope.logout = function(){
      return security.logout();
    };
  }
]);

angular.module('base').controller('ContactCtrl', ['$scope', 'utility', 'accountResource',
  function($scope, utility, restResource){
    // local var
    var successAlert = { type: 'success', msg: 'We have received your message. Thank you.' };
    var errorAlert = { type: 'warning', msg: 'Error submitting your message. Please try again.' };

    // model def
    $scope.msg = {};
    $scope.alerts = [];

    // method def
    $scope.hasError = utility.hasError;
    $scope.showError = utility.showError;
    $scope.canSave = utility.canSave;
    $scope.closeAlert = function(ind){
      $scope.alerts.splice(ind, 1);
    };
    $scope.submit = function(){
      var msg = $scope.msg;
      $scope.alerts = [];
      restResource.sendMessage({
        name: msg.name,
        email: msg.email,
        message: msg.message
      }).then(function(data){
        $scope.msgForm.$setPristine();
        $scope.msg = {};
        if(data.success){
          $scope.alerts.push(successAlert);
        }else{
          //TODO: optionally do case study errfor/errors
          $scope.alerts.push(errorAlert);
        }
      }, function(x){
        $scope.msgForm.$setPristine();
        $scope.msg = {};
        $scope.alerts.push(errorAlert);
      });
    };
  }
]);
