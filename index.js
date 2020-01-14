'use strict';

const { SchemaPack, SchemaPackOrchestrator } = require('./lib/schemapack.js');
global.validationWorkerCount = 0;

module.exports = {
  // Old API wrapping the new API
  convert: function(input, options, cb) {
    var schema = new SchemaPack(input, options);

    if (schema.validated) {
      return schema.convert(cb);
    }

    return cb(null, schema.validationResult);
  },

  validate: function(input) {
    var schema = new SchemaPack(input);
    return schema.validationResult;
  },

  getOptions: function() {
    return SchemaPack.getOptions();
  },

  // new API
  SchemaPack,
  SchemaPackOrchestrator
};
