#!/usr/bin/env node

'use strict';

var io = require('../lib/io');
var file = require('../lib/file');

io.promptSetup()
  .then(file.updateConfig);
