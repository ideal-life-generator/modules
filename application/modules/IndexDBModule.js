(function() {
  var app;

  app = angular.module("IndexDB", []);

  app.provider("IndexDB", function() {
    var IndexDB;
    return IndexDB = {
      api: 20,
      $get: [
        "$q", function($q) {
          var DBStore;
          DBStore = (function() {
            function DBStore(db, name) {
              this.db = db;
              this.name = name;
            }

            DBStore.prototype.put = function(key, data, transactionEvents, storeEvents) {
              var deferPut, put, store, transaction;
              deferPut = $q.defer();
              transaction = this.db.transaction([this.name], "readwrite");
              store = transaction.objectStore(this.name);
              put = store.put({
                api: key,
                data: data
              });
              put.onsuccess = function(event) {
                return deferPut.resolve(event.target);
              };
              put.onerror = function(event) {
                return deferPut.reject(event.target.error);
              };
              return deferPut.promise;
            };

            DBStore.prototype.get = function(key) {
              var deferGet, get, store, transaction;
              deferGet = $q.defer();
              transaction = this.db.transaction([this.name], "readonly");
              store = transaction.objectStore(this.name);
              get = store.get(key);
              get.onsuccess = function(event) {
                var data, _ref;
                data = (_ref = event.target.result) != null ? _ref.data : void 0;
                if (data) {
                  return deferGet.resolve(data);
                } else {
                  return deferGet.reject(data);
                }
              };
              get.onerror = function(event) {
                var error;
                error = event.target.error;
                return deferGet.reject(error);
              };
              return deferGet.promise;
            };

            DBStore.prototype["delete"] = function(key, storeEvents) {
              var callback, event, remove, store, transaction, _results;
              transaction = this.db.transaction([this.name], "readwrite");
              store = transaction.objectStore(this.name);
              remove = store["delete"](key);
              _results = [];
              for (event in storeEvents) {
                callback = storeEvents[event];
                _results.push((function(event, callback) {
                  return remove[event] = function(event) {
                    return callback(event.target);
                  };
                })(event, callback));
              }
              return _results;
            };

            return DBStore;

          })();
          return {
            loadDB: function(onsuccess, onerror) {
              var request;
              request = indexedDB.open(IndexDB.db, IndexDB.version);
              request.onupgradeneeded = (function(_this) {
                return function(event) {
                  var db, store, _i, _len, _ref, _results;
                  console.log("onupgradeneeded");
                  db = event.target.result;
                  _ref = IndexDB.defineStores;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    store = _ref[_i];
                    if (!db.objectStoreNames.contains(store.name)) {
                      _results.push(db.createObjectStore(store.name, {
                        keyPath: store.keyPath
                      }));
                    }
                  }
                  return _results;
                };
              })(this);
              request.onsuccess = function(event) {
                var db;
                console.log("onsuccess");
                db = event.target.result;
                return onsuccess(db, DBStore);
              };
              return request.onerror = function(event) {
                var error;
                console.log("error:", event.target.error);
                error = event.target.error;
                return onerror(error);
              };
            }
          };
        }
      ]
    };
  });

}).call(this);
