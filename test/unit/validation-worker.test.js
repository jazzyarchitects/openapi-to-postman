/* eslint-disable */

var Converter = require('../..'),
  fs = require('fs'),
  path = require('path'),
  expect = require('chai').expect,
  VALID_OPENAPI_PATH = '../data/validationData/spec-to-validate-against.json',
  HISTORY_PATH = '../data/validationData/history_obj.json';

var openapi = JSON.parse(fs.readFileSync(path.join(__dirname, VALID_OPENAPI_PATH), 'utf8')),
  historyRequest = JSON.parse(fs.readFileSync(path.join(__dirname, HISTORY_PATH), 'utf8'));


describe('Validaiton in workers', function () {
  it('should validate properly', function (done) {
    const schemaPack = new Converter.SchemaPackOrchestrator({ type: 'json', data: openapi },
      { max_workers: 2, timeout: 5 * 1000 });

    schemaPack.validateTransaction(historyRequest, (err, result) => {
      // result is as described in the Schema <> Validation Doc
      expect(err).to.not.exist;

      expect(result).to.be.ok;
      expect(Object.keys(result.requests)).to.have.members(['r1', 'r2']);

      return done();
    });
  });

  it('should return MaxConcurrencyLockTimeoutError if not able to acquire workers within timout', function (done) {
    const schemaPack = new Converter.SchemaPackOrchestrator({ type: 'json', data: openapi },
      { max_workers: -1, timeout: 1 * 1000 });

    schemaPack.validateTransaction(historyRequest, (err, result) => {
      // result is as described in the Schema <> Validation Doc
      expect(err).to.be.an('Error');
      expect(err.message).to.eql('MaxConcurrencyLockTimeoutError');

      expect(result).to.not.exist;
      return done();
    });
  });

  it('should return -ValidationTimeoutError if validation does not finish in timeout', function (done) {
    const schemaPack = new Converter.SchemaPackOrchestrator({ type: 'json', data: openapi },
      { max_workers: 2, timeout: 0 * 1000 });

    schemaPack.validateTransaction(historyRequest, (err, result) => {
      // result is as described in the Schema <> Validation Doc
      expect(err).to.be.an('Error');
      expect(err.message).to.eql('ValidationTimeoutError');

      expect(result).to.not.exist;
      return done();
    });
  });
});
