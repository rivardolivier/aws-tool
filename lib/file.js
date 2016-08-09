'use strict';

var os = require('os');
var path = require('path');
var fs = require('fs');
var q = require('q');

const HOME_DIRECTORY = os.homedir();
const CONFIG_FILE_LOCATION = path.join(HOME_DIRECTORY, '.awstool.conf');

function updateConfig(config) {
  fs.writeFile(constants.CONFIG_FILE_LOCATION, JSON.stringify(config));
}

function getConfig() {

  var deferred = q.defer();

  fs.readFile(CONFIG_FILE_LOCATION, 'utf8', function (err,data) {

    if (err) {
      deferred.reject(err)
    }

    deferred.resolve(data);
  });

  return deferred.promise;
}

module.exports = {
  updateConfig: updateConfig,
  getConfig: getConfig
}
