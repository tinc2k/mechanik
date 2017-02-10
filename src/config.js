'use strict';

const development = {
  // for config.isDevelopment
  isDevelopment: true,
  SERVER: {
    api_version: 0.01,
    // enable server clustering
    cluster: true,
    // force/redirect to HTTPS
    force_https: false
    // certificate paths not required, as development environment doesn't run in HTTPS
  },
  REDIS: { 
    host: 'localhost',
    port: 6379
  },
  POSTGRES: {
    host: 'localhost',
    port: 5432,
    database: '',
    user: '',
    password: ''
  }
};

const integration = {
  isIntegration: true, // for config.isIntegration
  SERVER: {
    api_version: 0.01,
    cluster: true,
    force_https: true,
    certificate_path: 'certs/int/fullchain.pem',
    certificate_key_path: 'certs/int/privkey.pem'
  },
  REDIS: { 
    host: 'localhost',
    port: 6379
  },
  POSTGRES: {
    host: 'localhost',
    port: 5432,
    database: '',
    user: '',
    password: ''
  }
};

const production = {
  isProduction: true,  // for config.isProduction
  SERVER: {
    api_version: 0.01,
    cluster: true,
    force_https: true,
    certificate_path: 'certs/prod/fullchain.pem',
    certificate_key_path: 'certs/prod/privkey.pem'
  },
  REDIS: { 
    host: 'localhost',
    port: 6379
  },
  POSTGRES: {
    host: 'localhost',
    port: 5432,
    database: '',
    user: '',
    password: ''
  }
};



if (process.env.NODE_ENV === 'production')
  module.exports = production;
else if (process.env.NODE_ENV === 'integration')
  module.exports = integration;
else
  module.exports = development;