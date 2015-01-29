(function() {
  var Authentification;

  Authentification = angular.module("Authentification", []);

  Authentification.directive("authentification", [
    "$rootScope", "$http", function($rootScope, $http) {
      return {
        restrict: "E",
        replace: true,
        scope: {
          callback: "&"
        },
        template: '<form name="authorization" novalidate> <fieldset> <legend>Authorization form</legend> <input type="text" name="username" ng-model="username.value"> <input type="password" name="password" ng-model="password.value"> <button ng-click="submit(username.value, password.value)"> Send </button> </fieldset> </form>',
        link: function($scope, $element, $attributes) {
          return $scope.submit = function(username, password) {
            return $http({
              method: "POST",
              url: $attributes.api,
              data: {
                username: username,
                password: password
              }
            }).success(function(success) {
              $rootScope.User = success;
              return typeof $scope.callback === "function" ? $scope.callback() : void 0;
            }).error(function(error) {
              return error;
            });
          };
        }
      };
    }
  ]);

  Authentification.directive("logout", [
    "$rootScope", "$http", function($rootScope, $http) {
      return {
        restrict: "E",
        replace: true,
        scope: {
          callback: "&"
        },
        template: '<button ng-show="$root.User" ng-click="clearUser()"> Logout </button>',
        link: function($scope, $element, $attributes) {
          return $scope.clearUser = function() {
            delete $rootScope.User;
            return typeof $scope.callback === "function" ? $scope.callback() : void 0;
          };
        }
      };
    }
  ]);

}).call(this);
