Modules = angular.module "Modules", [ "ngRoute", "SuperHistory", "Authentification", "Cache" ]

Modules.constant "BaseUrl",
  base: "/"
  authorization: "/authorization"
  stores: "/stores"
  cache: "/cache"
  home: "/home"

Modules.config [
  "SuperHistoryProvider", "BaseUrl"
  (SuperHistoryProvider, BaseUrl) ->

    SuperHistoryProvider.setBase BaseUrl

]

Modules.config [
  "IndexDBProvider", "CacheProvider"
  (IndexDBProvider, CacheProvider) ->

    IndexDBProvider.db = "appDB"
    IndexDBProvider.defineStores = [
      name: "api"
      keyPath: "api"
    ]
    IndexDBProvider.version = 31

    CacheProvider.store = "api"

]

Modules.config [
  "$routeProvider", "BaseUrl"
  , ($routeProvider, BaseUrl) ->

    authСonfirm = [ 
      "$rootScope", "SuperHistory"
      ($rootScope, SuperHistory) ->

        SuperHistory.backBaseClear BaseUrl.authorization if $rootScope.User

    ]

    authDeny = [ 
      "$rootScope", "SuperHistory"
      ($rootScope, SuperHistory) ->

        SuperHistory.go BaseUrl.authorization unless $rootScope.User

    ]

    $routeProvider
      .when BaseUrl.authorization,
        templateUrl: "application/templates/authorization.html"
        resolve:
          authentification: authСonfirm
      .when BaseUrl.stores,
        templateUrl: "application/templates/stores.html"
        resolve:
          authentification: authDeny
      .when BaseUrl.cache,
        templateUrl: "application/templates/cache.html"
        controller: "CacheController"

]

Modules.run [
  "$rootScope", "BaseUrl", "Cache"
  ($rootScope, BaseUrl, Cache) ->

    $rootScope.$watch ->
      Cache.status
    , (actualStatus) ->

      $rootScope.applicationStatus = actualStatus

    $rootScope.BaseUrl = BaseUrl

]

Modules.controller "MainController", [
  "$rootScope", "$scope", "$route", "SuperHistory"
  ($rootScope, $scope, $route, SuperHistory) ->

    $scope.someCallback = ->
      SuperHistory.go "/stores"

    $scope.clearData = ->
      $route.reload()

]

Modules.controller "CacheController", [
  "$scope", "$http", "Cache"
  ($scope, $http, Cache) ->

    Cache.toCache [ 
      "/cars"
    ], [
      "/cars"
      (cars) ->

        $scope.cars = cars

    ]

    $scope.remove = ($index) ->
      $http.delete "/cars", $index: $index
      $scope.cars.splice $index, 1

]