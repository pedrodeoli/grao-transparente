const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const logger = require('./logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  logger.info('Conexão estabelecida com o banco de dados PostgreSQL.');
});

pool.on('error', (err) => {
  logger.error('Erro na conexão com o banco de dados:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
