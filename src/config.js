'use strict';

const development = {
  isDevelopment: true, // for config.isDevelopment
  Server: {
    apiVersion: 0.01,
    cluster: true, // enable server clustering
    forceHttps: false // force/redirect to HTTPS
    // certificate paths are not required, as (local) development environment doesn't run in HTTPS
  },
  Redis: {
    host: 'localhost',
    port: 6379
  },
  Postgres: {
    host: 'localhost',
    port: 5432,
    database: 'mechanik',
    user: 'mechanik',
    password: '',
    pool: { min: 2, max: 10 } // default { min: 2, max: 10 }
  }
};

const integration = {
  isIntegration: true, // for config.isIntegration
  Server: {
    apiVersion: 0.01,
    cluster: true, // enable server clustering
    forceHttps: true,
    certificatePath: 'certs/int/fullchain.pem',
    certificateKeyPath: 'certs/int/privkey.pem'
  },
  Redis: {
    host: 'localhost',
    port: 6379
  },
  Postgres: {
    host: 'localhost',
    port: 5432,
    database: 'mechanik',
    user: 'mechanik',
    password: '',
    pool: { min: 2, max: 10 } // default { min: 2, max: 10 }
  }
};

const production = {
  isProduction: true, // for config.isProduction
  Server: {
    apiVersion: 0.01,
    cluster: true,
    forceHttps: true,
    certificatePath: 'certs/prod/fullchain.pem',
    certificateKeyPath: 'certs/prod/privkey.pem'
  },
  Redis: {
    host: 'localhost',
    port: 6379
  },
  Postgres: {
    host: 'localhost',
    port: 5432,
    database: 'mechanik',
    user: 'mechanik',
    password: '',
    pool: { min: 2, max: 10 } // default { min: 2, max: 10 }
  }
};

module.exports = function(environment) {
  if (environment === 'production') {
    return production;
  } else if (environment === 'integration' || environment === 'staging') {
    return integration;
  } else {
    return development;
  }
};