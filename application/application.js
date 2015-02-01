(function() {
  var Modules;

  Modules = angular.module("Modules", ["ngRoute", "SuperHistory", "Authentification", "Cache"]);

  Modules.constant("BaseUrl", {
    base: "/",
    authorization: "/authorization",
    stores: "/stores",
    cache: "/cache",
    home: "/home"
  });

  Modules.config([
    "SuperHistoryProvider", "BaseUrl", function(SuperHistoryProvider, BaseUrl) {
      return SuperHistoryProvider.setBase(BaseUrl);
    }
  ]);

  Modules.config([
    "IndexDBProvider", "CacheProvider", function(IndexDBProvider, CacheProvider) {
      IndexDBProvider.db = "appDB";
      IndexDBProvider.defineStores = [
        {
          name: "api",
          keyPath: "api"
        }
      ];
      IndexDBProvider.version = 31;
      return CacheProvider.store = "api";
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
      }).when(BaseUrl.cache, {
        templateUrl: "application/templates/cache.html",
        controller: "CacheController"
      });
    }
  ]);

  Modules.run([
    "$rootScope", "BaseUrl", "Cache", function($rootScope, BaseUrl, Cache) {
      $rootScope.$watch(function() {
        return Cache.status;
      }, function(actualStatus) {
        return $rootScope.applicationStatus = actualStatus;
      });
      return $rootScope.BaseUrl = BaseUrl;
    }
  ]);

  Modules.controller("MainController", [
    "$rootScope", "$scope", "$route", "SuperHistory", function($rootScope, $scope, $route, SuperHistory) {
      $scope.someCallback = function() {
        return SuperHistory.go("/stores");
      };
      return $scope.clearData = function() {
        return $route.reload();
      };
    }
  ]);

  Modules.controller("CacheController", [
    "$scope", "$http", "Cache", function($scope, $http, Cache) {
      Cache.toCache(["/cars"], [
        "/cars", function(cars) {
          return $scope.cars = cars;
        }
      ]);
      return $scope.remove = function($index) {
        $http["delete"]("/cars", {
          $index: $index
        });
        return $scope.cars.splice($index, 1);
      };
    }
  ]);

}).call(this);
