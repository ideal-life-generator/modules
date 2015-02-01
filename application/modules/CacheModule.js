(function() {
  var app;

  app = angular.module("Cache", ["IndexDB"]);

  app.provider("Cache", function() {
    return {
      $get: [
        "$q", "$http", "IndexDB", function($q, $http, IndexDB) {
          var Cache, CacheComposite, Store, checkStatus, deferIndexDB, _checkStatus;
          deferIndexDB = $q.defer();
          Store = null;
          IndexDB.loadDB((function(_this) {
            return function(db, DBStore) {
              Store = new DBStore(db, _this.store);
              return deferIndexDB.resolve();
            };
          })(this), function(error) {
            console.error("Error in loadDB ( Cache module )");
            return deferIndexDB.reject();
          });
          Cache = (function() {
            function Cache(cached) {
              this.cached = cached;
              this.status = "none";
            }

            Cache.prototype.download = function() {
              var deferGet;
              deferGet = $q.defer();
              if (this.status === "loading") {
                this._setStatus("restarts");
              } else {
                this.status = "loading";
              }
              _checkStatus();
              ((function(_this) {
                return function(status) {
                  return $http.get(_this.cached).success(function(success) {
                    if (_this.status === "restarts" && status === "loading") {
                      return deferGet = null;
                    }
                    return Store.put(_this.cached, success).then(function(success) {
                      return Store.get(_this.cached).then(function(success) {
                        _this._setStatus("loaded");
                        return deferGet.resolve(success);
                      });
                    }, function(error) {
                      _this._setStatus("error");
                      return deferGet.reject(error);
                    });
                  }).error(function(error) {
                    if (_this.status === "restarts" && status === "loading") {
                      return;
                    }
                    return Store.get(_this.cached).then(function(success) {
                      _this._setStatus("cache");
                      return deferGet.resolve(success);
                    }, function(error) {
                      _this._setStatus("error");
                      return deferGet.reject(error);
                    });
                  });
                };
              })(this))(this.status);
              return deferGet.promise;
            };

            Cache.prototype._setStatus = function(type) {
              this.status = type;
              return _checkStatus();
            };

            return Cache;

          })();
          CacheComposite = {
            status: null,
            cechable: new Object,
            toCache: function(cechable, requested) {
              var count, request, requestedCallback, requestedType, _i, _len;
              requestedType = Object.prototype.toString.call(requested).slice(8, -1);
              if (requestedType === "Array") {
                requestedCallback = requested.splice(requested.length - 1)[0];
                for (_i = 0, _len = requested.length; _i < _len; _i++) {
                  request = requested[_i];
                  if (-1 === cechable.indexOf(request)) {
                    return console.error("requested data \"" + request + "\" doesn't exist");
                  }
                }
              }
              count = 0;
              return deferIndexDB.promise.then((function(_this) {
                return function() {
                  var cached, _j, _len1, _results;
                  _results = [];
                  for (_j = 0, _len1 = cechable.length; _j < _len1; _j++) {
                    cached = cechable[_j];
                    _results.push((function(cached) {
                      var index;
                      if (!CacheComposite.cechable[cached]) {
                        CacheComposite.cechable[cached] = new Cache(cached);
                      }
                      if (requestedType === "Array") {
                        index = requested.indexOf(cached);
                      }
                      return CacheComposite.cechable[cached].download().then(function(success) {
                        if (requestedType === "Array") {
                          requested[index] = success;
                        }
                        if (requested && ++count === cechable.length) {
                          if (requested && requestedType === "Function") {
                            return requested(_this.status);
                          } else if (requestedType === "Array") {
                            return requestedCallback.apply(_this, requested);
                          }
                        }
                      }, function(error) {
                        return console.error("processing \"download: " + cached + "\" encountered errors and aren't cached");
                      });
                    })(cached));
                  }
                  return _results;
                };
              })(this));
            }
          };
          checkStatus = function() {
            var cache, cached, _ref, _results;
            _ref = this.cechable;
            _results = [];
            for (cached in _ref) {
              cache = _ref[cached];
              if (cache.status === "error") {
                this.status = "error";
                break;
              } else if (cache.status === "cache") {
                this.status = "cache";
                break;
              } else if (cache.status === "restarts") {
                this.status = "restarts";
                break;
              } else if (cache.status === "loading") {
                this.status = "loading";
                break;
              } else if (cache.status === "loaded") {
                _results.push(this.status = "loaded");
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          };
          _checkStatus = checkStatus.bind(CacheComposite);
          return CacheComposite;
        }
      ]
    };
  });

}).call(this);
