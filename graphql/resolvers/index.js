const authResolver = require('./auth');
const regResolver = require('./registration');
const eventResolver = require('./event')

const rootResolver = {
  ...authResolver,
  ...regResolver,
  ...eventResolver
};

module.exports = rootResolver;
