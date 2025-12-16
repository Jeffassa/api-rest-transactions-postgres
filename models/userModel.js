// models/userModel.js

const db = require('../config/db');

// Crée un utilisateur dans la base
exports.create = async (nom, email, telephone) => {
    try {
        const result = await db.query(
            `INSERT INTO users (nom, email, telephone)
             VALUES ($1, $2, $3)
             RETURNING id, nom, email, telephone, created_at`,
            [nom, email, telephone]
        );
        return result.rows[0];
    } catch (error) {
        if (error.code === '23505') { 
            throw new Error(`Erreur: L'email "${email}" est déjà utilisé.`);
        }
        throw error;
    }
};

// Récupère TOUS les utilisateurs
exports.findAll = async () => {
    try {
        const result = await db.query(
            "SELECT id, nom, email, telephone, created_at FROM users ORDER BY created_at DESC"
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// Récupère un utilisateur grâce à son id
exports.findById = async (id) => {
    try {
        const result = await db.query(
            "SELECT id, nom, email, telephone, created_at FROM users WHERE id = $1",
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw error;
    }
};

// Met à jour les informations d'un utilisateur
exports.update = async (id, nom, email, telephone) => {
    try {
        const result = await db.query(
            `UPDATE users
             SET nom = $1, email = $2, telephone = $3
             WHERE id = $4
             RETURNING id, nom, email, telephone`,
            [nom, email, telephone, id]
        );
        return result.rows[0] || null;
    } catch (error) {
        if (error.code === '23505') {
            throw new Error(`Erreur: L'email "${email}" est déjà utilisé par un autre utilisateur.`);
        }
        throw error;
    }
};

// Supprime un utilisateur (et ses transactions grâce à ON DELETE CASCADE)
exports.delete = async (id) => {
    try {
        const result = await db.query(
            "DELETE FROM users WHERE id = $1 RETURNING id",
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw error;
    }
};