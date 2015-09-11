// Generated by CoffeeScript 1.8.0
(function() {
  var defaultUuid, exec, linuxUuid, os, osxUuid, uuid, uuidRegex, winUuid;

  exec = require("child_process").exec;

  os = require("os");

  uuid = void 0;

  uuidRegex = /\w{8}\-\w{4}\-\w{4}\-\w{4}\-\w{12}/;

  module.exports = function(cb) {
    var platFormSpecific, platformGetUuid;
    if (uuid) {
      return setImmediate(function() {
        return cb(uuid);
      });
    }
    platFormSpecific = {
      'darwin': osxUuid,
      'win32': winUuid,
      'win64': winUuid,
      'linux': linuxUuid
    };
    platformGetUuid = platFormSpecific[os.platform()];
    if (platformGetUuid) {
      return platformGetUuid(function(err, id) {
        if (err) {
          return defaultUuid(cb);
        } else {
          return cb(uuid = id);
        }
      });
    } else {
      return defaultUuid(cb);
    }
  };

  linuxUuid = function(cb) {
    var e, fs;
    try {
      fs = require("fs");
      return uuid = fs.readFile("/var/lib/dbus/machine-id", function(err, content) {
        if (content) {
          uuid = content.toString().replace(/\s+/, '');
          if ((!/\-/.test(uuid)) && uuid.length > 20) {
            uuid = uuid.slice(0, 8) + '-' + uuid.slice(8, 12) + '-' + uuid.slice(12, 16) + '-' + uuid.slice(16, 20) + '-' + uuid.slice(20);
          }
        }
        return cb(err, content ? uuid : void 0);
      });
    } catch (_error) {
      e = _error;
      return defaultUuid(cb);
    }
  };

  osxUuid = function(cb) {
    return exec("ioreg -rd1 -c IOPlatformExpertDevice", function(err, stdout, stderr) {
      var line, _i, _len, _ref;
      if (err) {
        return cb(err);
      }
      _ref = stdout.split("\n");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (/IOPlatformUUID/.test(line) && uuidRegex.test(line)) {
          return cb(null, uuidRegex.exec(line)[0]);
        }
      }
      return cb(new Error("No match"));
    });
  };

  winUuid = function(cb) {
    return exec("wmic CsProduct Get UUID", function(err, stdout, stderr) {
      var line, _i, _len, _ref;
      if (err) {
        return cb(err);
      }
      _ref = stdout.split("\n");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (uuidRegex.test(line)) {
          return cb(null, uuidRegex.exec(line)[0]);
        }
      }
      return cb(new Error("No match"));
    });
  };

  defaultUuid = function(cb) {
    var f, fs, id, path;
    path = require("path");
    fs = require("fs");
    f = path.resolve(__dirname, '.nodemid');
    if (fs.existsSync(f)) {
      return cb(fs.readFileSync(f).toString());
    } else {
      id = require('node-uuid').v1();
      fs.writeFileSync(f, id);
      return cb(id);
    }
  };

}).call(this);

//# sourceMappingURL=index.js.map
