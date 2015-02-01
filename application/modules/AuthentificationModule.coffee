Authentification = angular.module "Authentification", [ ]

Authentification.directive "authentification", [
  "$rootScope", "$http"
  ($rootScope, $http) ->

    restrict: "E"
    replace: on
    scope:
      callback: "&"
    template: '<form name="authorization"
                     novalidate>
                 <fieldset>
                   <legend>Authorization form</legend>
                   <input type="text"
                          name="username"
                          ng-model="username.value">
                   <input type="password"
                          name="password"
                          ng-model="password.value">
                   <button ng-click="submit(username.value, password.value)">
                     Send
                   </button>
                 </fieldset>
               </form>'
    link: ($scope, $element, $attributes) ->

      $scope.submit = (username, password) ->
        $http
          method: "POST"
          url: $attributes.api
          data:
            username: username
            password: password
        .success (success) ->
          $rootScope.User = success
          $scope.callback?()
        .error (error) ->
          error

]

Authentification.directive "logout", [
  "$rootScope", "$http"
  ($rootScope, $http) ->

    restrict: "E"
    replace: on
    scope:
      callback: "&"
    template: '<button ng-show="$root.User"
                       ng-click="clearUser()">
                 Logout
               </button>'
    link: ($scope, $element, $attributes) ->

      $scope.clearUser = ->
        delete $rootScope.User
        $scope.callback?()

]