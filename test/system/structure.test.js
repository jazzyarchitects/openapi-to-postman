let expect = require('chai').expect,
  getOptions = require('../../index').getOptions;

const optionsIds = [
    'schemaFaker',
    'collapseLongFolders',
    'rootRequestBodyType',
    'exampleBodyType',
    'folderStrategy',
    'indentCharacter',
    'requestNameSource'
  ],
  expectedOptions = {
    schemaFaker: {
      name: 'Fake schema',
      id: 'schemaFaker',
      type: 'boolean',
      default: true,
      description: 'Fake the schema using json or xml schema faker'
    },
    collapseLongFolders: {
      name: 'Collapse folder for long routes',
      id: 'collapseLongFolders',
      type: 'boolean',
      default: true,
      description: 'Collapse folders in case of long routes leading to unnecessary folders'
    },
    rootRequestBodyType: {
      name: 'Set root request body type',
      id: 'rootRequestBodyType',
      type: 'string',
      default: 'schema',
      description: 'Option for setting root request body between schema or example'
    },
    exampleBodyType: {
      name: 'Set example request and response body type',
      id: 'exampleBodyType',
      type: 'string',
      default: 'example',
      description: 'Option for setting example request and response body between schema or example'
    },
    folderStrategy: {
      name: 'Set folder strategy',
      id: 'folderStrategy',
      type: 'string',
      default: 'paths',
      description: 'Option for setting folder creating strategy between paths or tags'
    },
    indentCharacter: {
      name: 'Set indent character',
      id: 'indentCharacter',
      type: 'string',
      default: ' ',
      description: 'Option for setting indentation character'
    },
    requestNameSource: {
      name: 'Set request name source',
      id: 'requestNameSource',
      type: 'string',
      default: 'fallback',
      description: 'Option for setting source for a request name'
    }
  };

describe('getOptions', function() {
  let options = getOptions();

  it('must be a valid id and should be present in the whitelist of options id', function () {
    options.forEach((option) => {
      expect(option.id).to.be.oneOf(optionsIds);
    });
  });

  it('must have a valid structure', function () {
    options.forEach((option) => {
      expect(option).to.have.property('name');
      expect(option).to.have.property('id');
      expect(option).to.have.property('type');
      expect(option).to.have.property('default');
      expect(option).to.have.property('description');
    });
  });

  it('must have consistent type, description and name', function () {
    options.forEach((option) => {
      if (expectedOptions[option.id]) {
        expect(option).to.have.property('description');
        expect(option.name).to.be.eql(expectedOptions[option.id].name);
        expect(option.type).to.be.eql(expectedOptions[option.id].type);
        expect(option.description).to.be.eql(expectedOptions[option.id].description);
      }
      else {
        console.warn(`Option ${option.name} not present in the list of expected options.`);
      }
    });
  });
});
