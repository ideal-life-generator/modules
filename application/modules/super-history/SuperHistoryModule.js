(function() {
  var SuperHistory;

  SuperHistory = angular.module("SuperHistory", []);

  SuperHistory.provider("SuperHistory", function() {
    var BaseUrl;
    BaseUrl = new Object;
    return {
      setBase: function(list) {
        return BaseUrl = list;
      },
      $get: [
        "$rootScope", "$location", function($rootScope, $location) {
          var superHistory;
          SuperHistory = (function() {
            function SuperHistory() {
              this.paths = [];
              this.paths.push(BaseUrl.base);
              this.now = 0;
              this.path = $location.$$path;
            }

            SuperHistory.prototype.go = function(path) {
              if (path !== this.paths[this.paths.length - 1]) {
                this.paths.push(path);
                this.now = this.paths.length - 1;
                return $location.path(this.path = path);
              }
            };

            SuperHistory.prototype.back = function() {
              if (this.now > 0) {
                this.now = --this.now;
                return $location.path(this.path = this.paths[this.now]);
              } else {
                return $location.path(this.path = this.paths[0]);
              }
            };

            SuperHistory.prototype.backClear = function() {
              if (this.now > 0) {
                this.now = --this.now;
                this.paths = this.paths.slice(0, this.now + 1);
                return $location.path(this.path = this.paths[this.now]);
              } else {
                return $location.path(this.path = this.paths[0]);
              }
            };

            SuperHistory.prototype.backBase = function(except) {
              var historyPath, i, path, pathName, _i, _ref;
              if (this.now > 0) {
                _ref = this.paths;
                for (i = _i = _ref.length - 1; _i >= 0; i = _i += -1) {
                  historyPath = _ref[i];
                  for (pathName in BaseUrl) {
                    path = BaseUrl[pathName];
                    if (!(path === historyPath && path !== except)) {
                      continue;
                    }
                    this.now = i;
                    return $location.path(this.path = path);
                  }
                }
              } else {
                return $location.path(this.path = this.paths[0]);
              }
            };

            SuperHistory.prototype.backBaseClear = function(except) {
              var historyPath, i, path, pathName, _i, _ref;
              if (this.now > 0) {
                _ref = this.paths;
                for (i = _i = _ref.length - 1; _i >= 0; i = _i += -1) {
                  historyPath = _ref[i];
                  for (pathName in BaseUrl) {
                    path = BaseUrl[pathName];
                    if (!(path === historyPath && path !== except)) {
                      continue;
                    }
                    this.now = i;
                    this.paths = this.paths.slice(0, this.now + 1);
                    return $location.path(this.path = path);
                  }
                }
              } else {
                return $location.path(this.path = this.paths[0]);
              }
            };

            SuperHistory.prototype.forward = function() {
              if (this.now < this.paths.length - 1) {
                this.now = ++this.now;
                return $location.path(this.path = this.paths[this.now]);
              }
            };

            SuperHistory.prototype.forwardBase = function(except) {
              var historyPath, i, path, pathName, _i, _len, _ref;
              if (this.now < this.paths.length - 1) {
                _ref = this.paths;
                for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                  historyPath = _ref[i];
                  if (i > this.now) {
                    for (pathName in BaseUrl) {
                      path = BaseUrl[pathName];
                      if (!(path === historyPath && path !== except)) {
                        continue;
                      }
                      this.now = i;
                      return $location.path(this.path = path);
                    }
                  }
                }
              }
            };

            return SuperHistory;

          })();
          superHistory = new SuperHistory;
          $rootScope.$on("$routeChangeStart", function(path) {
            return superHistory.go($location.$$path);
          });
          return superHistory;
        }
      ]
    };
  });

}).call(this);
