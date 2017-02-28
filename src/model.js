'use strict';

const crypto = require('crypto');
const moment = require('moment-timezone');

const config = require('./config')(process.env.NODE_ENV);
const knex = require('knex')({
  client: 'postgresql',
  connection: {
    host: `${config.Postgres.host}:${config.Postgres.port}`,
    user: config.Postgres.user,
    password: config.Postgres.password,
    database: config.Postgres.database,
    charset: 'utf8'
  },
  pool: config.Postgres.pool,
  migrations: { tableName: 'knex_migrations'}
  // debug: true
});
const helpers = require('./helpers');
const log = require('./logger')('Model');
const bookshelf = require('bookshelf')(knex);

// https://github.com/tgriesser/bookshelf/wiki/Plugin:-Virtuals
bookshelf.plugin('virtuals');

// https://github.com/tgriesser/bookshelf/wiki/Plugin:-Visibility
bookshelf.plugin('visibility');

const Enums = {
  Role: {
    Administrator: 1,
    Moderator: 2,
    User: 3
  }
};

var User = bookshelf.Model.extend({
  tableName: 'User',
  hasTimestamps: ['createdAt', 'updatedAt'],
  hidden: ['passwordSalt', 'passwordHash'],
  validTokens() {
    return this.hasMany(Token, 'userId').query(q => {
      // unexpired tokens only
      q.where('expiresAt', '<', moment.utc().toISOString());
    });
  },
  virtuals: {
    isAdministrator() {
      return this.get('role') === Enums.Role.Administrator;
    },
    isModerator() {
      return this.get('role') === Enums.Role.Moderator;
    },
    isInfluencer() {
      return this.get('role') === Enums.Role.Influencer;
    }
  }
}, {
  generatePasswordHash(salt, password) {
    let str = salt + password;
    log.verbose('Generating password hash.', str);
    let hash = crypto.createHash('sha256').update(str).digest('hex');
    return hash;
  },
  toPublicJSON(i) {
    return {
      id: i.id,
      username: i.username,
      role: i.role,
      email: i.email,
      isActive: i.isActive
    };
  }
});

var Token = bookshelf.Model.extend({
  tableName: 'Token',
  hasTimestamps: ['createdAt', 'updatedAt'],
  user() {
    return this.belongsTo(User, 'userId');
  }
}, {
  generateApiToken() {
    let token = helpers.getRandomHex(32);
    log.verbose('Generated new API token.', token);
    return token;
  }
});

module.exports = {
  Enums,
  User,
  Token
};
