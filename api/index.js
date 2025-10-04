// api/index.js - VERSIÓN CORREGIDA
const app = require('../backend/dist/index.js').default;

module.exports = async function handler(req, res) {
  return app(req, res);
};