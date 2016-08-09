'use strict';

var AWS = require('aws-sdk');
var q = require('q');
var _ = require('lodash');

function buildAutoscalingOptions(config) {
  return {
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    }
  };
}

function buildParams(instanceName) {

  if (!instanceName) return {};

  return { Filters: [{
        Name: 'tag:app',
        Values: [name]
    }]};
}

function buildInstanceInfo(instance) {

  var instanceInfo = {};
  instanceInfo.privateIp = instance.PrivateIpAddress || 'n/a';
  instanceInfo.publicIp = instance.PublicIpAddress || 'n/a';
  instanceInfo.status = instance.State.Name || 'n/a';
  instanceInfo.name = 'n/a';
  _.forEach(instance.Tags, function(tag) {
    if (tag.Key === "Name") {
      instanceInfo.name = tag.Value;
    }
  });

  return instanceInfo;
}

function listApplications(config, instanceName) {

  var deferred = q.defer();

  var autoscalingOptions = buildAutoscalingOptions(config);
  var ec2 = new AWS.EC2(autoscalingOptions);

  ec2.describeInstances(buildParams(instanceName), function(err, data) {

    var listInstances = [];

    if (err) {
      deferred.reject(err);
    }

    _.forEach(data.Reservations, function(reservation) {
      _.forEach(reservation.Instances, function(instance) {
        listInstances.push(buildInstanceInfo(instance));
      });
    });

    deferred.resolve(listInstances);
  });

  return deferred.promise;
}

module.exports = {
  buildAutoscalingOptions: buildAutoscalingOptions,
  listApplications: listApplications
};
