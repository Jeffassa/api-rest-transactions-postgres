// config/db.js

const { Pool } = require('pg');

// Le Pool utilise automatiquement les variables d'environnement .env
const pool = new Pool();

// Exportation des fonctions de base de la connexion
module.exports = {
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect(),
};