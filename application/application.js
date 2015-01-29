(function() {
  var Modules;

  Modules = angular.module("Modules", ["SuperHistory", "Authentification", "ngRoute"]);

  Modules.constant("BaseUrl", {
    base: "/",
    authorization: "/authorization",
    stores: "/stores"
  });

  Modules.config([
    "SuperHistoryProvider", "BaseUrl", function(SuperHistoryProvider, BaseUrl) {
      return SuperHistoryProvider.setBase(BaseUrl);
    }
  ]);

  Modules.config([
    "$routeProvider", "BaseUrl", function($routeProvider, BaseUrl) {
      var authDeny, authСonfirm;
      authСonfirm = [
        "$rootScope", "SuperHistory", function($rootScope, SuperHistory) {
          if ($rootScope.User) {
            return SuperHistory.backBaseClear(BaseUrl.authorization);
          }
        }
      ];
      authDeny = [
        "$rootScope", "SuperHistory", function($rootScope, SuperHistory) {
          if (!$rootScope.User) {
            return SuperHistory.go(BaseUrl.authorization);
          }
        }
      ];
      return $routeProvider.when(BaseUrl.authorization, {
        templateUrl: "application/templates/authorization.html",
        resolve: {
          authentification: authСonfirm
        }
      }).when(BaseUrl.stores, {
        templateUrl: "application/templates/stores.html",
        resolve: {
          authentification: authDeny
        }
      });
    }
  ]);

  Modules.run([
    "$rootScope", "BaseUrl", function($rootScope, BaseUrl) {
      return $rootScope.BaseUrl = BaseUrl;
    }
  ]);

  Modules.controller("MainController", [
    "$rootScope", "$scope", "SuperHistory", "$route", function($rootScope, $scope, SuperHistory, $route) {
      $scope.someCallback = function() {
        return SuperHistory.go("/stores");
      };
      return $scope.clearData = function() {
        return $route.reload();
      };
    }
  ]);

}).call(this);
