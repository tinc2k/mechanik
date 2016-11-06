'use strict';

const development = {
  isDevelopment: true, // for config.isDevelopment
  SERVER: {
    api_version: 0.01,
    cluster: true,
    forceHttps: false,
    certificate_path: 'certs/dev/fullchain.pem',
    certificate_key_path: 'certs/dev/privkey.pem'
  },
  REDIS: { 
    host: process.env.REDIS_PORT_6379_TCP_ADDR ? process.env.REDIS_PORT_6379_TCP_ADDR : 'localhost',
    port: 6379
  },
  POSTGRES: {
    host: process.env.POSTGRES_PORT_5432_TCP_ADDR ? process.env.POSTGRES_PORT_5432_TCP_ADDR : 'localhost',
    port: 5432,
    database: '',
    user: '',
    password: ''
  }
};
const integration = {
    isIntegration: true, // for config.isIntegration
};
const production = {
    isProduction: true,  // for config.isProduction
};