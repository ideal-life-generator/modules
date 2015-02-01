app = angular.module "IndexDB", [ ]

app.provider "IndexDB", ->

  IndexDB =

    api: 20
  
    $get: [ 
      "$q"
      ($q) ->
    
        class DBStore
          constructor: (@db, name) ->
            @name = name
        
          put: (key, data, transactionEvents, storeEvents) ->
            deferPut = $q.defer()
            transaction = @db.transaction [ @name ], "readwrite"
            store = transaction.objectStore @name

            put = store.put api: key, data: data
            put.onsuccess = (event) ->
              deferPut.resolve event.target

            put.onerror = (event) ->
              deferPut.reject event.target.error

            deferPut.promise
        
          get: (key) ->
            deferGet = $q.defer()
            transaction = @db.transaction [ @name ], "readonly"
            store = transaction.objectStore @name
        
            get = store.get key
            get.onsuccess = (event) ->
              data = event.target.result?.data
              if data
                deferGet.resolve data
              else
                deferGet.reject data

            get.onerror = (event) ->
              error = event.target.error
              deferGet.reject error

            deferGet.promise
        
          delete: (key, storeEvents) ->
            transaction = @db.transaction [ @name ], "readwrite"
            store = transaction.objectStore @name
  
            remove = store.delete key
            for event, callback of storeEvents
              do (event, callback) ->
                remove[event] = (event) ->
                  callback event.target
  
        loadDB: (onsuccess, onerror) ->
          request = indexedDB.open IndexDB.db, IndexDB.version
  
          request.onupgradeneeded = (event) =>
            console.log "onupgradeneeded"
  
            db = event.target.result
        
            db.createObjectStore store.name, keyPath: store.keyPath for store in IndexDB.defineStores when not db.objectStoreNames.contains store.name
        
          request.onsuccess = (event) ->
            console.log "onsuccess"
        
            db = event.target.result
      
            onsuccess db, DBStore
        
          request.onerror = (event) ->
            console.log "error:", event.target.error
        
            error = event.target.error

            onerror error
  
    ]