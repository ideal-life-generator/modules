app = angular.module "Cache", [ "IndexDB" ]

app.provider "Cache", ->

  $get: [
    "$q", "$http", "IndexDB"
    ($q, $http, IndexDB) ->

      deferIndexDB = $q.defer()

      Store = null

      IndexDB.loadDB (db, DBStore) =>
        Store = new DBStore db, @store
        deferIndexDB.resolve()
      , (error) ->
        console.error "Error in loadDB ( Cache module )"
        deferIndexDB.reject()

      class Cache
        constructor: (@cached) ->
          @status = "none" # none loading restarts loaded cached error

        download: ->
          deferGet = $q.defer()
          if @status is "loading" then @_setStatus "restarts" else @status = "loading"
          _checkStatus()
          ((status) =>
            $http.get @cached
              .success (success) =>
                return deferGet = null if @status is "restarts" and status is "loading"
                Store.put @cached, success
                  .then (success) =>
                    Store.get @cached
                      .then (success) =>
                        @_setStatus "loaded"
                        deferGet.resolve success
                  , (error) =>
                    @_setStatus "error"
                    deferGet.reject error

              .error (error) =>
                return if @status is "restarts" and status is "loading"
                Store.get @cached
                  .then (success) =>
                    @_setStatus "cache"
                    deferGet.resolve success

                  , (error) =>
                    @_setStatus "error"
                    deferGet.reject error

          )(@status)
          deferGet.promise

        _setStatus: (type) ->
          @status = type
          _checkStatus()

      CacheComposite =
        status: null # none loading loaded cached error
        cechable: new Object

        toCache: (cechable, requested) ->
          requestedType = Object.prototype.toString.call(requested).slice(8, -1)
          if requestedType is "Array"
            requestedCallback = requested.splice(requested.length-1)[0]
            return console.error "requested data \"#{request}\" doesn't exist" for request in requested when -1 is cechable.indexOf request
          count = 0
          deferIndexDB.promise.then =>
            for cached in cechable
              do (cached) =>
                CacheComposite.cechable[cached] = new Cache cached unless CacheComposite.cechable[cached]
                index = requested.indexOf cached if requestedType is "Array"
                CacheComposite.cechable[cached].download()
                  .then (success) =>
                    if requestedType is "Array"
                      requested[index] = success
                    if requested and ++count is cechable.length
                      if requested and requestedType is "Function"
                        requested @status
                      else if requestedType is "Array"
                        requestedCallback.apply @, requested
                  , (error) =>
                    console.error "processing \"download: #{cached}\" encountered errors and aren't cached"


      checkStatus = ->
        for cached, cache of @cechable
          if cache.status is "error" then @status = "error" ;break
          else if cache.status is "cache" then @status = "cache" ;break
          else if cache.status is "restarts" then @status = "restarts" ;break
          else if cache.status is "loading" then @status = "loading" ;break
          else if cache.status is "loaded" then @status = "loaded"

      _checkStatus = checkStatus.bind CacheComposite

      CacheComposite

  ]