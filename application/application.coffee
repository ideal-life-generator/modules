Modules = angular.module "Modules", [ "SuperHistory", "Authentification", "ngRoute" ]

Modules.constant "BaseUrl",
  base: "/"
  authorization: "/authorization"
  stores: "/stores"

Modules.config [
  "SuperHistoryProvider", "BaseUrl"
  , (SuperHistoryProvider, BaseUrl) ->

    SuperHistoryProvider.setBase BaseUrl

]

Modules.config [
  "$routeProvider", "BaseUrl"
  , ($routeProvider, BaseUrl) ->

    authСonfirm = [ 
      "$rootScope", "SuperHistory"
      , ($rootScope, SuperHistory) ->

        SuperHistory.backBaseClear BaseUrl.authorization if $rootScope.User

    ]

    authDeny = [ 
      "$rootScope", "SuperHistory"
      , ($rootScope, SuperHistory) ->

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


]

Modules.run [
  "$rootScope", "BaseUrl"
  , ($rootScope, BaseUrl) ->

    $rootScope.BaseUrl = BaseUrl

]

Modules.controller "MainController", [
  "$rootScope", "$scope", "SuperHistory", "$route"
  , ($rootScope, $scope, SuperHistory, $route) ->

    $scope.someCallback = ->
      SuperHistory.go "/stores"

    $scope.clearData = ->
      $route.reload()

]