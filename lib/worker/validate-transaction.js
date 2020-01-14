const program = require('commander'),
  SchemaPack = require('../schemapack').SchemaPack,
  exitCodes = {
    error: 1,
    validationError: 2,
    success: 0
  };

global.isValidationWorker = true;

program
  .command('validate')
  .option('-i, --input [value]', 'Base64 encoded input')
  .option('-t, --transactions [value]', 'Base64 encoded transactions array')
  .action(function (args) {
    if (!args.input) {
      process.stderr.write('Schema not provided');
      return process.exit(exitCodes.error);
    }

    if (!args.transactions) {
      process.stderr.write('Transactions not provided');
      return process.exit(exitCodes.error);
    }

    let input = JSON.parse(Buffer.from(args.input, 'base64').toString()),
      transactions = JSON.parse(Buffer.from(args.transactions, 'base64').toString());

    if (!Array.isArray(transactions)) {
      process.stderr.write('Transactions is not valid');
      return process.exit(exitCodes.error);
    }

    const schemaPack = new SchemaPack(input, {});

    schemaPack.validateTransaction(transactions, (err, result) => {
      if (err) {
        console.error(err);
        return process.exit(exitCodes.validationError);
      }

      const data = Buffer.from(JSON.stringify(result), 'utf-8').toString('base64');

      process.send(data);

      // This fork will exit after sending data
    });
  });

program.parse(process.argv);
