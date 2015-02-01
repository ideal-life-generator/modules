SuperHistory = angular.module "SuperHistory", [  ]

SuperHistory.provider "SuperHistory", ->

  BaseUrl = new Object

  setBase: (list) ->
    BaseUrl = list

  $get: [
    "$rootScope", "$location"
    ($rootScope, $location) ->

      class SuperHistory
        constructor: ->
          @paths = [ ]
          @paths.push BaseUrl.base
          @now = 0
          @path = $location.$$path
  
        go: (path) ->
          unless path is @paths[@paths.length-1]
            @paths.push path
            @now = @paths.length-1
            $location.path @path = path
  
        back: ->
          if @now > 0
            @now = --@now
            $location.path @path = @paths[@now]
          else
            $location.path @path = @paths[0]
  
        backClear: ->
          if @now > 0
            @now = --@now
            @paths = @paths.slice 0, @now+1
            $location.path @path = @paths[@now]
          else
            $location.path @path = @paths[0]
  
        backBase: (except) ->
          if @now > 0
            for historyPath, i in @paths by -1
              for pathName, path of BaseUrl when path is historyPath and path isnt except
                @now = i
                return $location.path @path = path
          else
            $location.path @path = @paths[0]
  
        backBaseClear: (except) ->
          if @now > 0
            for historyPath, i in @paths by -1
              for pathName, path of BaseUrl when path is historyPath and path isnt except
                @now = i
                @paths = @paths.slice 0, @now+1
                return $location.path @path = path
          else
            $location.path @path = @paths[0]
  
        forward: ->
          if @now < @paths.length-1
            @now = ++@now
            $location.path @path = @paths[@now]
  
        forwardBase: (except) ->
          if @now < @paths.length-1
            for historyPath, i in @paths when i > @now
              for pathName, path of BaseUrl when path is historyPath and path isnt except
                @now = i
                return $location.path @path = path
  
      superHistory = new SuperHistory
  
      $rootScope.$on "$routeChangeStart", (path) ->
        superHistory.go $location.$$path
  
      superHistory

  ]