'use strict';

const prod = require('./build/config')('production');
const int = require('./build/config')('integration');
const dev = require('./build/config')('development');

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: `${dev.Postgres.host}:${dev.Postgres.port}`,
      user: dev.Postgres.user,
      password: dev.Postgres.password,
      database: dev.Postgres.database,
      charset: 'utf8'
    },
    pool: dev.Postgres.pool,
    migrations: {tableName: 'knex_migrations'}
  },

  staging: {
    client: 'postgresql',
    connection: {
      host: `${int.Postgres.host}:${int.Postgres.port}`,
      user: int.Postgres.user,
      password: int.Postgres.password,
      database: int.Postgres.database,
      charset: 'utf8'
    },
    pool: int.Postgres.pool,
    migrations: {tableName: 'knex_migrations'}
  },

  production: {
    client: 'postgresql',
    connection: {
      host: `${prod.Postgres.host}:${prod.Postgres.port}`,
      user: prod.Postgres.user,
      password: prod.Postgres.password,
      database: prod.Postgres.database,
      charset: 'utf8'
    },
    pool: prod.Postgres.pool,
    migrations: {tableName: 'knex_migrations'}
  }
};
